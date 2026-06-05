import { test as base, expect } from '@playwright/test';

// grow_tests appends one import line per new page class above this comment.
// Imports come from './page-loader' (the barrel) — not direct page class paths.
// example: import { LoginPage } from './page-loader';

const test = base.extend<{
  // fixture-types: grow_tests appends one type entry per feature below this line
  // example: loginPage: LoginPage;
}>({
  // fixture-impls: grow_tests appends one fixture entry per feature below this line
  // example: loginPage: async ({ page }, use) => { await use(new LoginPage(page)); },
});

export { test, expect };
