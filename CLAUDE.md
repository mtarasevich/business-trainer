# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

This is **not** a website codebase — it's a **multi-agent site-building pipeline**. The repo defines a chain of specialized Claude Code subagents (in `.claude/agents/`) that turn a client brief into a static HTML/CSS/JS landing page. Per-project working directories live under `project/<slug>/`.

The whole system is in Russian. Agent prompts, briefs, and artifacts are written in Russian — preserve that language when editing agent definitions or generating artifacts.

## How a project runs

User invokes the pipeline with: *"запусти site-orchestrator для проекта `<slug>`"*. The orchestrator (`.claude/agents/site-orchestrator.md`) is the only entry point — it does no work itself, it dispatches subagents in sequence and tracks state.

Pipeline stages, each producing a numbered artifact in `project/<slug>/`:

| # | Stage      | Agent             | Output            |
|---|------------|-------------------|-------------------|
| 1 | Brief      | `site-analyst`    | `00-brief.md`, `01-requirements.md` |
| 2 | Marketing  | `site-marketer`   | `02-marketing.md` |
| 3 | Content    | `content-maker`   | `03-content.md`   |
| 4 | Design     | `site-designer`   | `04-design.md`    |
| 5 | Build      | `site-developer`  | `05-build/` (static HTML + Tailwind CDN) |
| 6 | QA         | `site-qa`         | `06-qa-report.md` |

Side-channel agent: `client-proxy` simulates the client when the analyst has open questions. `inputs/` is read-only for agents.

Orchestrator also maintains:
- `STATE.md` — current stage, round counter, blockers
- `ASSUMPTIONS.md` — every "wild guess" any agent had to make (this is the deliverable for the real client meeting)

## Critical pipeline rules

- **Iteration limits per stage** are defined in `site-orchestrator.md` (mostly 2–3 rounds). When exceeded: stages 1–4 record a wild guess and continue; stages 5–6 (developer/QA) **pause and ask the user** — never wild-guess technical bugs.
- **Context isolation**: the orchestrator passes each subagent only the artifacts it needs (e.g. designer gets `02-marketing.md` + `03-content.md` + `inputs/` media; developer gets `03-content.md` + `04-design.md`). Don't broaden inputs casually — the agent prompts are tuned to those specific files.
- **Wild guess protocol**: if a question can't be answered from `inputs/` or `client-proxy`, the agent picks a sensible default and appends an entry to `ASSUMPTIONS.md` with the question, the substituted value, and how to confirm it with the client. Then it keeps going — never blocks.
- The build target is **static HTML/CSS/JS with Tailwind via CDN** (no build step, no framework). Don't introduce npm/bundlers into `05-build/`.

## Common commands

Bootstrap a new project:
```bash
cp -r project/_template project/<slug>
# then fill project/<slug>/inputs/brief.md and drop media files (flat, no subdirs)
```

Serve a finished build for QA or preview:
```bash
python -m http.server 8080 --directory project/<slug>/05-build
```

The orchestrator itself runs the QA server on a random free port (`--http.server 0`) and kills it after stage 6.

## Editing agents

Each file in `.claude/agents/*.md` is a full subagent prompt — frontmatter (`name`, `description`) plus a Russian system prompt defining role, inputs, outputs, and handoff rules. When changing one agent's I/O contract, check `site-orchestrator.md`'s "Что какому агенту передавать" table and the surrounding stage matrix — they must stay in sync.
