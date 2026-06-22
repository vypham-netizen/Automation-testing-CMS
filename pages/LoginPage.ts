import { Page, Locator } from '@playwright/test';

/**
 * Page Object cho màn Đăng nhập.
 * Ý tưởng: gom tất cả "địa chỉ" của các ô/nút trên màn login vào 1 chỗ.
 * Khi UI đổi, chỉ sửa ở đây — không phải sửa từng file test.
 */
export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // ⚠️ SELECTOR TẠM — hãy chỉnh lại cho khớp app thật.
    // Cách nhanh: chạy `npm run codegen`, bấm tay vào ô đăng nhập,
    // Playwright sẽ tự sinh selector đúng → copy vào đây.
    this.usernameInput = page.getByPlaceholder('Tên đăng nhập');
    this.passwordInput = page.getByPlaceholder('Mật khẩu');
    this.submitButton = page.getByRole('button', { name: 'Đăng nhập' });
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
