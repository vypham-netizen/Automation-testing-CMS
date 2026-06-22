import { Page, Locator } from '@playwright/test';

/**
 * Page Object cho màn Quản lý TID/MID.
 * Selector dưới đây lấy từ giao diện thật mình đã xem qua Playwright.
 */
export class TidMidPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly searchBox: Locator;
  readonly exportButton: Locator;
  readonly moreButton: Locator;        // nút "..." chứa Gửi bank / Import / Bàn giao...

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByText('Danh sách TID/MID');
    this.searchBox = page.getByPlaceholder('Tên MC, TID, MID, tên viết tắt MC');
    this.exportButton = page.getByRole('button', { name: 'Xuất Excel' });
    this.moreButton = page.getByRole('button', { name: 'ellipsis' });
  }

  async goto() {
    await this.page.goto('/tid-mid-management?page=1');
  }

  async search(keyword: string) {
    await this.searchBox.fill(keyword);
    await this.page.keyboard.press('Enter');
  }

  async openActionMenu() {
    await this.moreButton.click();
  }
}
