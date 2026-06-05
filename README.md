# ordino-tests

End-to-end tests built with [Playwright](https://playwright.dev/) and TypeScript, generated and maintained by [Ordino](https://ordino.io).

---

## Prerequisites

- Node.js 20+
- npm 10+

---

## Setup

1. **Install dependencies**
   ```bash
   npm install
   npx playwright install chromium --with-deps
   ```

2. **Configure the target URL**

   Copy `.env` and set `BASE_URL` to the app you want to test:
   ```
   BASE_URL=https://your-app.example.com
   ```

---

## Running tests

| Command | What it does |
|---|---|
| `npm test` | Run all tests headlessly |
| `npm run test:headed` | Run all tests with a visible browser |
| `npm run ui:headless` | Alias for headless run (used in CI) |
| `npm run audit` | TypeScript typecheck — run this before committing |

Test results land in `test-results/`:
- `test-results/html-report/` — Playwright HTML report
- `test-results/results.json` — JSON report (pipeline import)
- `test-results/results.xml` — JUnit XML (CI reporter)

---

## Folder structure

```
.
├── features/                        # Test specs (one file per feature)
│   ├── smoke.spec.ts                # Bootstrap reachability check
│   └── <feature>.spec.ts
│
├── src/
│   ├── config/
│   │   ├── page-loader.ts           # Barrel — all page objects, panels, and test data
│   │   └── page.config.ts           # Playwright fixtures (extends base test)
│   │
│   ├── data/
│   │   └── <feature>/
│   │       └── expected.json        # Asserted UI strings for that feature
│   │
│   └── gui/
│       ├── pages/
│       │   ├── BasePage.ts          # Shared Playwright utilities (extended by all pages)
│       │   └── <Feature>Page.ts     # One class per web page
│       └── panels/
│           └── <Feature>Panel.ts    # Reusable DOM regions (header, nav, modal, etc.)
│
├── ordino/
│   └── specs/
│       └── <feature>.story.md       # Feature intent, acceptance criteria, scenarios
│
├── .ordino/                         # Agent memory cache (not committed)
│   ├── elements.json                # Validated locators with last_validated timestamps
│   ├── nav.json                     # Known navigation paths
│   ├── pages.json                   # Known page inventory
│   └── features.json                # Known feature inventory
│
├── test-results/                    # Generated output (not committed)
├── playwright.config.ts
├── tsconfig.json
├── package.json
└── .env                             # Local only — never committed
```

---

## Adding a new feature

Each feature follows a consistent 7-token naming convention derived from a single lowercase noun (e.g. `login`):

| Token | Example |
|---|---|
| Story file | `ordino/specs/login.story.md` |
| Data folder | `src/data/login/` |
| Page class | `LoginPage` in `src/gui/pages/LoginPage.ts` |
| Fixture key | `loginPage` |
| Barrel export | `loginExpected` |
| Spec file | `features/login.spec.ts` |
| Describe title | `'MyApp - Login'` |

To add tests for a new feature, use the **grow_tests** workflow in Ordino. It handles story discovery, page object authoring, fixture wiring, and spec generation in one guided pass.

---

## Key conventions

- **Locators use XPath first.** `page.locator('//input[@name="username"]')` is the default. `getByRole` is a last resort for Shadow DOM only.
- **No `expect()` in spec bodies.** All assertions live in `verify_*` methods on page objects.
- **No hardcoded URLs in specs.** `BASE_URL` comes from `.env` via `playwright.config.ts`.
- **Test titles start with an AC tag.** `[AC-1] should display error on invalid login`
- **Typecheck before committing.** `npm run audit`
