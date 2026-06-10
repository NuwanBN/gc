// spec: ordino/specs/product-creation.story.md
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductCreationPage } from '../pages/ProductCreationPage';

const VALID_EMAIL = 'kexeda3953@pazuric.com';
const VALID_PASSWORD = 'Test@123';

function uniqueProductName(prefix: string): string {
  return `${prefix}-${Date.now()}`;
}

test.describe('Product Creation', () => {
  test.describe.configure({ timeout: 120000 });

  // scenario: Happy Path
  test('[AC-1] should create product, verify list, and clean up', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productCreationPage = new ProductCreationPage(page);

    const productName = uniqueProductName('autoprod-ac1');

    await loginPage.goto();
    await loginPage.step_login(VALID_EMAIL, VALID_PASSWORD);
    await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible();

    await productCreationPage.gotoProducts();
    await productCreationPage.step_openCreateForm();
    await productCreationPage.step_fillRequiredFields(productName);
    await productCreationPage.step_submitCreate();
    await productCreationPage.verify_createdToast(productName);

    await productCreationPage.step_deleteProductByName(productName);
  });

  // scenario: Duplicate product name
  test('[AC-2] should create second product, reject duplicate, and clean up', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productCreationPage = new ProductCreationPage(page);

    const productName = uniqueProductName('autoprod-ac2');

    await loginPage.goto();
    await loginPage.step_login(VALID_EMAIL, VALID_PASSWORD);
    await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible();

    await productCreationPage.gotoProducts();
    await productCreationPage.step_openCreateForm();
    await productCreationPage.step_fillRequiredFields(productName);
    await productCreationPage.step_submitCreate();
    await productCreationPage.verify_createdToast(productName);

    await productCreationPage.step_openCreateForm();
    await productCreationPage.step_fillRequiredFields(productName);
    await productCreationPage.step_submitCreate();
    await productCreationPage.verify_duplicateNameError();

    await productCreationPage.step_deleteProductByName(productName);
  });
});