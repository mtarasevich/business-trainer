# Multi-agent site builder

End-to-end создание сайтов через цепочку специализированных Claude Code агентов.

## Запуск

1. Создай папку проекта:
   ```bash
   cp -r project/_template project/<slug>
   ```
2. Заполни `project/<slug>/inputs/brief.md` — там же блок «Ссылки» (текущий сайт, конкуренты, референсы).
3. Кидай в `project/<slug>/inputs/` всё подряд: фото, видео, PDF, скриншоты, логотипы — **без подпапок**.
4. В Claude Code скажи:
   > запусти site-orchestrator для проекта `<slug>`

Оркестратор сам поведёт пайплайн через всех агентов. Wild guesses (если чего-то не хватает в брифе) будут подставлены и собраны в `project/<slug>/ASSUMPTIONS.md` для финального подтверждения с заказчиком.

## Этапы пайплайна

| # | Этап | Артефакт | Агент |
|---|---|---|---|
| 1 | Бриф | `00-brief.md`, `01-requirements.md` | site-analyst |
| 2 | Маркетинг | `02-marketing.md` | site-marketer |
| 3 | Контент | `03-content.md` | content-maker |
| 4 | Дизайн | `04-design.md` | site-designer |
| 5 | Разработка | `05-build/` | site-developer |
| 6 | QA | `06-qa-report.md` | site-qa |
| 7 | Финальная апрувка | — | вы |

## Вспомогательные агенты

- **client-proxy** — отвечает на вопросы агентов от лица заказчика, помечает wild guesses
- **site-orchestrator** — главный, не делает работу, координирует

## Проверка результата

После завершения — открой `project/<slug>/05-build/index.html` или подними локальный сервер:
```bash
python -m http.server 8080 --directory project/<slug>/05-build
```

Прочитай `project/<slug>/ASSUMPTIONS.md` — это вопросы для встречи с реальным заказчиком.
