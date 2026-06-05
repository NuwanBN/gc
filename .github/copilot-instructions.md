<!-- ordino:start -->
# Ordino Rules

## Project-specific overrides
- Before starting any task, read `ordino/rules.md` — it contains project-specific overrides that take precedence over everything below
- Never delete or overwrite any file inside the `ordino/` folder

## Story traceability contract
- Story acceptance criteria must use stable keys: `AC-<n>:` under `# Acceptance Criteria`
- Every test file must start with `// spec: ordino/specs/<feature>.story.md`
- Every test block must include `// scenario: <scenario-name>` before `test()`
- Every test title must start with exactly one `[AC-x]` tag (e.g. `[AC-1] should ...`) — tag first, one tag only, ID must exist in the linked story file's `# Acceptance Criteria`
- Scenario headings in story files must end with the linked AC tag: `## Happy Path [AC-1]`
- If any traceability field is missing or invalid, report it plainly and fix it before finishing

## Starting work
- Classify the user's intent before doing anything
- If the intent matches one of the workflows below, call `ordino_start_task` with the exact `intent` value shown:
  - Set up Playwright automation from scratch → `"project_bootstrap"`
  - Write, add, update tests or fill coverage gaps → `"grow_tests"`
  - Fix a specific failing or broken test → `"fix_test"`
  - Run existing tests against a URL (smoke test) → `"smoke_verify"`
  - Stabilise flaky or intermittently failing tests → `"heal_flaky"`
  - Refactor tests without behaviour change → `"refactor"`
  - Find missing test coverage → `"gap_analysis"`
  - Add or fix CI for Playwright tests → `"ci_setup"`
- If a matching job is already active: call `ordino_get_task_status` to resume
- For everything else (coding, documentation, domain/context/spec authoring, general questions): work directly — do not call ordino tools
- Never start a job without a real job_id from `ordino_start_task` or `ordino_get_task_status`

## During a workflow
- Follow the phase pack exactly — role, steps, done condition, required and forbidden tools
- Never skip, combine, or shortcut phases
- Advance with `ordino_next_phase` only after the done condition is fully met
- If a tool returns an error: stop, report it plainly, do not work around it

## Asking questions
- ALL questions go through `ordino_ask_user` — never type a question in chat
- Never preface or repeat a question in chat text before or after calling `ordino_ask_user`
- The elicitation popup is the only place the user sees questions

## Language
- Never mention: Ordino, workflow, intent, phase, job, MCP, session, classify, checkpoint, or any internal system term
- Speak plain language — what you found, what you did, what's next

## Never do
- Scaffold, write files, or create configs manually — always go through the Ordino tools
- Use placeholder values, fake URLs, or nil UUIDs
- Guess or invent a job_id
- Write test files, page objects, or CI configs outside the Ordino workflow

<!-- ordino:end -->
