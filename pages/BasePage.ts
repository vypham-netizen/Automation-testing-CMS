import { Page, Locator } from '@playwright/test';

/**
 * BasePage — lớp cha cho mọi Page Object.
 * Gom các thao tác dùng chung với component Ant Design (dropdown, datepicker).
 * Các Page khác `extends BasePage` để xài lại, không copy code.
 */
export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Mở 1 ant-select rồi trả về dropdown đang mở.
   * Escape trước để đóng dropdown cũ (tránh race khi mở liên tiếp).
   * @param trigger id của select (string) hoặc Locator của chính ô select.
   */
  protected async openDropdown(trigger: string | Locator): Promise<Locator> {
    await this.page.keyboard.press('Escape').catch(() => {});
    await this.page.waitForTimeout(120);
    const sel = typeof trigger === 'string'
      ? this.page.locator(`.ant-select:has(#${trigger})`).first()
      : trigger;
    await sel.locator('.ant-select-selector').first().click({ force: true });
    const dd = this.page.locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)').last();
    await dd.locator('.ant-select-item-option').first().waitFor();
    return dd;
  }

  /** Chọn option ĐẦU TIÊN trong dropdown. */
  protected async selFirst(trigger: string | Locator) {
    const dd = await this.openDropdown(trigger);
    await dd.locator('.ant-select-item-option').first().click();
  }

  /** Chọn option theo thuộc tính title (khớp tuyệt đối). */
  protected async selTitle(trigger: string | Locator, title: string) {
    const dd = await this.openDropdown(trigger);
    await dd.locator(`.ant-select-item-option[title="${title}"]`).first().click();
  }

  /** Chọn option theo text chứa trong option (khớp tương đối). */
  protected async selText(trigger: string | Locator, text: string) {
    const dd = await this.openDropdown(trigger);
    await dd.locator('.ant-select-item-option', { hasText: text }).first().click();
  }

  /** Điền 1 ô ant-picker (date) theo thứ tự xuất hiện trên màn. */
  protected async setDate(idx: number, value: string) {
    const inp = this.page.locator('.ant-picker input').nth(idx);
    await inp.click();
    await inp.fill(value);
    await inp.press('Enter');
  }

  /**
   * Chọn option trong ant-select có ô tìm kiếm: mở → gõ `term` → chọn option đầu khớp.
   * Dùng cho list dài/ảo hoá (vd ngân hàng) hoặc masterdata khác nhau theo môi trường.
   */
  protected async selSearch(id: string, term: string) {
    await this.page.keyboard.press('Escape').catch(() => {});
    await this.page.waitForTimeout(120);
    await this.page.locator(`.ant-select:has(#${id}) .ant-select-selector`).first().click();
    await this.page.locator(`#${id}`).fill(term);
    const dd = this.page.locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)').last();
    await dd.locator('.ant-select-item-option').first().waitFor();
    await dd.locator('.ant-select-item-option').first().click();
  }

  /** Locator dòng bảng chứa `text` (vd số seri / tên MC). */
  protected row(text: string): Locator {
    return this.page.locator('tbody tr').filter({ hasText: text }).first();
  }

  /** Tick checkbox của dòng chứa `text`. */
  protected async tickRow(text: string) {
    await this.row(text).locator('input.ant-checkbox-input').first().check();
  }

  /** Nút "Xác nhận" trong modal đang mở. */
  protected modalConfirm(): Locator {
    return this.page.locator('.ant-modal-content button', { hasText: 'Xác nhận' }).first();
  }
}
