# QA-отчёт

**Билд:** `05-build/`
**Сервер:** http://localhost:8765 (python http.server, PID см. STATE.md)
**Размер билда:** 5.7 MB (из них видео 2.7 MB)

## Авто-проверки

| # | Проверка | Результат |
|---|---|---|
| 1 | HTTP 200 на `/` | ✓ 24.2 KB |
| 2 | CSS отдаётся как text/css | ✓ |
| 3 | JS отдаётся как text/javascript | ✓ |
| 4 | Все картинки галереи доступны (9 thumb + 9 full) | ✓ |
| 5 | Hero картинка + mobile-вариант | ✓ |
| 6 | Видео `training.mp4` отдаётся как `video/mp4` | ✓ |
| 7 | Постер видео отдаётся | ✓ |
| 8 | HTML-теги сбалансированы (Python HTMLParser) | ✓ |
| 9 | Битых внутренних путей в `href`/`src` | 0 |
| 10 | Все интерактивные элементы имеют labels/aria | ✓ |
| 11 | Все `<img>` имеют `alt` | ✓ |
| 12 | Lazy-loading на не-hero картинках | ✓ |
| 13 | `loading="eager" fetchpriority="high"` только на hero | ✓ |

## Сверка с дизайном (`04-design.md`)

| Элемент | Спека | Билд | Совпадает |
|---|---|---|---|
| Палитра | --bg #FBFCFA, --brand #1E7F4F | те же CSS-vars | ✓ |
| Шрифты | Manrope + Inter | Google Fonts loaded | ✓ |
| Hero 60/40 | grid 1.2fr/1fr | ✓ | ✓ |
| Цифры — 4 в ряд | grid-template-columns:repeat(4,1fr) | ✓ | ✓ |
| Услуги — 2x2 | repeat(2,1fr) | ✓ | ✓ |
| Кейсы — вертикально, цифра слева | grid 200px 1fr | ✓ | ✓ |
| Timeline образования | left-line + circles | ✓ | ✓ |
| Галерея 3 колонки | repeat(3,1fr) | ✓ | ✓ |
| Lightbox с keyboard nav | esc/←/→ | ✓ | ✓ |
| Header sticky + blur | `position:sticky` + `backdrop-filter` | ✓ | ✓ |
| Footer тёмный | bg --ink | ✓ | ✓ |
| Скрытие nav на ≤1024 + burger | media query | ✓ | ✓ |

## Сверка с контентом (`03-content.md`)

- Hero one-liner — точно по тексту ✓
- 4 цифры на странице — 20+, 50+, ×3, ×4 ✓
- 4 карточки услуг — все 4 с CTA-ссылками + data-form-type для предзаполнения формы ✓
- Темы (13 чипов) и сегменты (7 чипов) — полный список из контента ✓
- 3 кейса — порядок и цифры совпадают ✓
- 6 пунктов timeline образования — соответствуют ✓
- Подкаст YouTube + локальное видео — оба плеера ✓
- Галерея 9 фото — выбраны без `photo_*_21-51-00.jpg` (битый, 12kb) ✓
- Контакты email/tel/telegram/viber — все 4 кликабельные ссылки ✓
- Форма submit → mailto: c subject + body ✓

## Доступность

- skip-link на `#main` ✓
- aria-label на бургере, lightbox, навигации ✓
- aria-modal + Esc на lightbox ✓
- focus-visible с outline --brand ✓
- Контраст основного текста (--ink #0F1A14 на --bg #FBFCFA) — AAA ✓
- prefers-reduced-motion — анимации отключаются ✓
- Все изображения с осмысленными alt ✓
- semantic HTML5 (header/main/section/article/nav/footer) ✓

## Производительность

- Hero 91KB, mobile-вариант 53KB, srcset через `<picture>` ✓
- Все галерейные изображения — отдельные thumb (~50–80KB) и full (~150–250KB) ✓
- YouTube iframe `loading="lazy"` ✓
- Локальное видео `preload="none"` + poster ✓
- Один CSS-файл, один JS-файл, без бандлеров ✓
- Шрифты — preconnect + display=swap ✓
- JS — `defer` ✓

## Совместимость

- Vanilla JS без модулей; работает в современных Chrome/Firefox/Safari/Edge ✓
- IntersectionObserver fallback (если нет — все .reveal сразу видимы) ✓
- backdrop-filter с `-webkit-` префиксом для Safari ✓
- mask с `-webkit-mask` для иконки галочки в `.ticks` ✓

## Известные ограничения / not-blocker

1. **Форма работает через mailto:** — полноценный backend-приём заявок отсутствует (см. требования: out of scope). Если у клиента будет нужен Formspree/Getform — добавится 5 строк fetch.
2. **Аналитики нет** — слот в `<head>` оставлен (комментарий `<!-- analytics slot -->`), ID не вставлен.
3. **Логотип текстовый** (инициалы в круге) — wild guess, см. ASSUMPTIONS.
4. **Цены не отображаются** — wild guess, см. ASSUMPTIONS.

## Раунд QA: 1/3
## Вердикт: PASS

Блокеров нет. Готово к показу клиенту.
