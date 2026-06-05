import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  // locator-helper: email input #email
  private readonly emailInput: Locator;
  // locator-helper: password input #password
  private readonly passwordInput: Locator;
  // locator-helper: submit button #login (disabled when fields empty)
  readonly loginButton: Locator;
  // locator-helper: inline error alert #login-error (role=alert)
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput    = page.locator('#email');
    this.passwordInput = page.locator('#password');
    this.loginButton   = page.locator('#login');
    this.errorMessage  = page.locator('#login-error');
  }

  async goto(): Promise<this> {
    await this.page.goto('/login', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await this.loginButton.waitFor({ state: 'visible', timeout: 15000 });
    return this;
  }

  async step_fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  async step_fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async step_submit(): Promise<void> {
    await this.loginButton.click();
  }

  async step_login(email: string, password: string): Promise<void> {
    await this.step_fillEmail(email);
    await this.step_fillPassword(password);
    await this.step_submit();
  }

  async verify_errorVisible(expectedText: string): Promise<void> {
    await this.waitForElement(this.errorMessage);
    await this.errorMessage.isVisible();
  }
}
