// spec: ordino/specs/login.story.md
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { USERNAME, PASSWORD } from '../playwright.config';

test.describe('Login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  // scenario: Happy Path
  test('[AC-1] should navigate to dashboard with valid credentials', async ({ page }) => {
    await loginPage.step_login(USERNAME, PASSWORD);
    await page.waitForURL('/');
    await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible();
  });

  // scenario: Wrong password
  test('[AC-2] should show error message with incorrect password', async ({ page }) => {
    await loginPage.step_login(USERNAME, 'WrongPassword!');
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Incorrect username or password');
  });

  // scenario: Empty fields
  test('[AC-3] should disable login button when fields are empty', async ({ page }) => {
    await expect(loginPage.loginButton).toBeDisabled();
  });
});
