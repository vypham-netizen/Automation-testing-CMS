import { Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object màn Quản lý TID/MID + các thao tác trong luồng:
 * Gửi bank → Import (bank phản hồi) → Bàn giao BD → Tạm hoãn / Hủy.
 * Đường dẫn: /tid-mid-management (menu có thể ẩn theo quyền nhưng route vẫn vào được).
 *
 * Cách tick dòng: lọc theo SỐ SERI (cột Thiết bị) — không phụ thuộc ô tìm kiếm.
 * Cột (có cột checkbox đầu): 4=Trạng thái, 5=Tiến trình, 12=Kết quả phản hồi bank.
 */
export class TidMidPage extends BasePage {
  readonly heading: Locator;
  readonly searchBox: Locator;
  readonly exportButton: Locator;
  readonly moreButton: Locator; // nút "..." Chức năng

  constructor(page: import('@playwright/test').Page) {
    super(page);
    this.heading = page.getByText('Danh sách TID/MID');
    this.searchBox = page.getByPlaceholder('Tên MC, TID, MID, tên viết tắt MC');
    this.exportButton = page.getByRole('button', { name: 'Xuất Excel' });
    this.moreButton = page.locator('button:has(.anticon-ellipsis)').first();
  }

  async goto() {
    await this.page.goto('/tid-mid-management?page=1');
    await this.heading.waitFor();
  }

  async search(keyword: string) {
    await this.searchBox.fill(keyword);
    await this.searchBox.press('Enter');
    await this.page.waitForTimeout(600);
  }

  /** Bỏ tick mọi dòng đang chọn (tránh chọn nhầm nhiều dòng giữa các thao tác). */
  private async uncheckAll() {
    const checked = this.page.locator('tbody tr .ant-checkbox-checked input');
    for (let n = await checked.count(); n > 0; n--) {
      await checked.first().uncheck({ force: true }).catch(() => {});
    }
  }

  /** Mở menu Chức năng (không click mục nào) — dùng để kiểm tra trạng thái enable/disable. */
  async openChucNang() {
    await this.moreButton.click();
  }

  /** Mở menu Chức năng và click 1 mục. */
  private async clickMenu(name: string) {
    await this.moreButton.click();
    await this.page
      .locator('.ant-dropdown:not(.ant-dropdown-hidden) [role=menuitem]', { hasText: name })
      .first()
      .click();
  }

  /** Đọc trạng thái / tiến trình / KQ bank của dòng theo seri. */
  async getRowState(seri: string) {
    const tds = this.row(seri).locator('td');
    const txt = async (i: number) => (await tds.nth(i).innerText()).replace(/\s+/g, ' ').trim();
    return { trangThai: await txt(4), tienTrinh: await txt(5), kqBank: await txt(12) };
  }

  /** Tick dòng theo seri rồi mở Chức năng → click action. */
  private async actOn(seri: string, action: string) {
    await this.uncheckAll();
    await this.tickRow(seri);
    await this.clickMenu(action);
  }

  /** Gửi yêu cầu cấp TID sang ngân hàng. */
  async guiBank(seri: string) {
    await this.actOn(seri, 'Gửi bank');
    await this.modalConfirm().click();
    await this.page.waitForTimeout(800);
  }

  /** Import file phản hồi ngân hàng (chấp nhận/từ chối). File phải khớp seri + NH của hợp đồng. */
  async importBankResult(filePath: string) {
    await this.clickMenu('Import file');
    await this.page.locator('.ant-modal-content input[type=file]').setInputFiles(filePath);
    await this.page.waitForTimeout(500);
    await this.modalConfirm().click();
    await this.page.waitForTimeout(1000);
  }

  /** Bàn giao thiết bị cho BD/đại lý (gửi mail tới đại lý). Yêu cầu TID đã Bank chấp nhận. */
  async banGiao(seri: string) {
    await this.actOn(seri, 'Bàn giao');
    await this.modalConfirm().click();
    await this.page.waitForTimeout(800);
  }

  /** Tạm hoãn TID (gửi mail đại lý). Lý do bắt buộc. */
  async tamHoan(seri: string, lyDo: string) {
    await this.actOn(seri, 'Tạm hoãn');
    await this.page.locator('.ant-modal-content textarea').fill(lyDo);
    await this.modalConfirm().click();
    await this.page.waitForTimeout(800);
  }

  /** Hủy yêu cầu cấp TID (gửi mail đại lý). Lý do bắt buộc. */
  async huy(seri: string, lyDo: string) {
    await this.actOn(seri, 'Hủy yêu cầu');
    await this.page.locator('.ant-modal-content textarea').fill(lyDo);
    await this.modalConfirm().click();
    await this.page.waitForTimeout(800);
  }

  /** Tra cứu dữ liệu TID bằng file (mapping TID/MID). */
  async traCuu(filePath: string) {
    await this.clickMenu('Tra cứu');
    await this.page.locator('.ant-modal-content input[type=file]').setInputFiles(filePath);
    await this.page.waitForTimeout(500);
  }
}
