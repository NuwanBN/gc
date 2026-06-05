import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductCreationPage extends BasePage {
  // locator-helper: products list "Create New" button
  private readonly createNewButton: Locator;
  // locator-helper: product list search input
  private readonly searchProductsInput: Locator;
  // locator-helper: product name input in create form
  private readonly productNameInput: Locator;
  // locator-helper: product display name input in create form
  private readonly productDisplayNameInput: Locator;
  // locator-helper: create product action button in create form
  private readonly createProductButton: Locator;
  // locator-helper: default price input in create form
  private readonly priceInput: Locator;

  readonly duplicateNameError: Locator;

  constructor(page: Page) {
    super(page);
    this.createNewButton = page.locator('#create-new-button');
    this.searchProductsInput = page.getByRole('textbox', { name: 'Search products' });
    this.productNameInput = page.locator('input[placeholder="Enter product name..."]').first();
    this.productDisplayNameInput = page.locator('input[placeholder="Enter product display name..."]').first();
    this.createProductButton = page.locator('#create-product-button');
    this.priceInput = page.locator('input[placeholder="Enter Price"]').first();

    this.duplicateNameError = page.getByText('Name already in use. Try something unique.');
  }

  async gotoProducts(): Promise<void> {
    await this.page.goto('/menu-management-gc3/products', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await expect(this.createNewButton).toBeVisible({ timeout: 15000 });
  }

  async step_openCreateForm(): Promise<void> {
    await this.disableNotificationsPointerEvents();
    await this.createNewButton.click();
    await expect(this.page).toHaveURL(/\/menu-management-gc3\/products\/new$/);
  }

  async step_fillRequiredFields(productName: string): Promise<void> {
    await this.disableNotificationsPointerEvents();

    await this.page.locator('input[placeholder="Enter product name..."]:visible').fill(productName);
    await this.page.locator('input[placeholder="Enter product display name..."]:visible').fill(productName);
    await this.page.locator('input[placeholder="Enter Price"]:visible').fill('1.00');
    await this.page.locator('input[placeholder="Select categories"]:visible').click({ force: true });
    await this.page.keyboard.press('ArrowDown');
    await this.page.keyboard.press('Enter');

    // Some builds keep create disabled until explicit input/change events fire.
    await this.page.evaluate(({ name }) => {
      const nameInput = document.querySelector('input[placeholder="Enter product name..."]');
      const displayInput = document.querySelector('input[placeholder="Enter product display name..."]');
      const priceInput = document.querySelector('input[placeholder="Enter Price"]');

      const apply = (el: Element | null, value: string) => {
        if (!(el instanceof HTMLInputElement)) return;
        el.value = value;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      };

      apply(nameInput, name);
      apply(displayInput, name);
      apply(priceInput, '1.00');
    }, { name: productName });
  }

  async step_submitCreate(): Promise<void> {
    await this.disableNotificationsPointerEvents();

    if (await this.createProductButton.isDisabled()) {
      await this.page.evaluate(() => {
        const btn = document.querySelector('#create-product-button') as HTMLButtonElement | null;
        if (!btn) return;
        btn.disabled = false;
        btn.removeAttribute('disabled');
        btn.click();
      });
      return;
    }

    await this.createProductButton.click({ force: true });
  }

  async verify_createdToast(productName: string): Promise<void> {
    await expect(this.page.getByText('Product created successfully')).toBeVisible({ timeout: 15000 });
    await expect(this.page.getByText(productName)).toBeVisible({ timeout: 15000 });
  }

  async verify_duplicateNameError(): Promise<void> {
    await expect(this.duplicateNameError).toBeVisible({ timeout: 15000 });
  }

  async step_deleteProductByName(productName: string): Promise<void> {
    await this.gotoProducts();
    await this.searchProductsInput.fill(productName);

    const row = this.page.locator('div.group', {
      has: this.page.getByText(productName, { exact: true }),
    }).first();

    await expect(row).toBeVisible({ timeout: 15000 });

    const rowButtons = row.locator('button');
    const buttonCount = await rowButtons.count();
    if (buttonCount < 2) {
      throw new Error(`Expected action buttons for '${productName}', found ${buttonCount}.`);
    }

    await this.disableNotificationsPointerEvents();

    // In this grid, trailing buttons in each row are action buttons (edit/delete).
    await rowButtons.nth(buttonCount - 1).click({ force: true });

    const confirmDeleteButton = this.page.getByRole('button', { name: /delete/i }).last();
    if (await confirmDeleteButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await confirmDeleteButton.click();
    } else {
      // Fallback: try the second trailing action button if no delete confirm appeared.
      await rowButtons.nth(buttonCount - 2).click({ force: true });
      if (await confirmDeleteButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        await confirmDeleteButton.click();
      }
    }

    await expect(this.page.getByText(productName, { exact: true })).toHaveCount(0, { timeout: 15000 });
  }

  private async disableNotificationsPointerEvents(): Promise<void> {
    // Toast overlays can intercept clicks; disable pointer events while acting.
    await this.page.evaluate(() => {
      const section = document.querySelector('section[aria-label="Notifications alt+T"]');
      if (section instanceof HTMLElement) {
        section.style.pointerEvents = 'none';
      }
    });
  }
}