// spec: ordino/specs/product.story.md
import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/gui/pages/LoginPage';
import { MenuManagementPage } from '../src/gui/pages/MenuManagementPage';
import { USERNAME, PASSWORD } from '../playwright.config';

test.describe('Product Navigation', () => {
  // scenario: Happy Path
  test('[AC-1] should move to Products from Menu Management GC3', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const menuManagementPage = new MenuManagementPage(page);

    await loginPage.goto();
    await loginPage.step_login(USERNAME, PASSWORD);

    await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible();
    await menuManagementPage.step_openProducts();

    await expect(menuManagementPage.productsLink).toBeVisible();
  });
});
