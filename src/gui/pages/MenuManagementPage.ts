import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class MenuManagementPage extends BasePage {
  readonly menuManagementGc3Toggle: Locator;
  readonly productsLink: Locator;
  readonly modifierGroupsLink: Locator;

  constructor(page: Page) {
    super(page);
    this.menuManagementGc3Toggle = page.getByRole('button', { name: 'Menu Management GC3' });
    this.productsLink = page.getByRole('link', { name: 'Products' });
    this.modifierGroupsLink = page.getByRole('link', { name: 'Modifier Groups' });
  }

  async step_openProducts(): Promise<void> {
    await this.waitForElement(this.menuManagementGc3Toggle, 15000);
    const expanded = await this.menuManagementGc3Toggle.getAttribute('aria-expanded');
    if (expanded !== 'true') {
      await this.menuManagementGc3Toggle.click();
    }

    await this.waitForElement(this.productsLink, 10000);
    await this.productsLink.click();

    // URL shape can vary by tenant; ensure we moved away from auth routes.
    await expect(this.page).not.toHaveURL(/\/login$/);
  }
}
