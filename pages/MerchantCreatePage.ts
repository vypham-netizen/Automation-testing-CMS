import { expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { MerchantData, PNG } from '../data/merchantData';
import { CONTRACT } from '../config/env';

/**
 * Page Object: màn Tạo merchant (Hộ kinh doanh) + gửi thẩm định.
 * Đường dẫn: /merchant/create
 */
export class MerchantCreatePage extends BasePage {
  /** Tạo 1 merchant hoàn chỉnh và gửi thẩm định. Kết thúc khi đã quay về /merchant. */
  async create(d: MerchantData) {
    await this.fillForm(d);
    await this.submitAppraisal(d);
  }

  /** Điền toàn bộ form tạo merchant (chưa gửi thẩm định). */
  async fillForm(d: MerchantData) {
    const page = this.page;

    await page.goto('/merchant/create');
    await page.locator('#merchantName').waitFor();

    // --- Thông tin tổ chức ---
    await this.selTitle('businessType', 'Hộ kinh doanh');
    await page.fill('#merchantName', d.name);
    await page.fill('#merchantShortName', d.shortName);
    await page.fill('#businessLicenseNumber', d.gpkd);
    await page.fill('#licenseIssuedPlace', 'So KHDT TP HCM');
    await page.fill('#taxCode', d.taxCode);
    await page.locator('#phoneNumber').nth(0).fill(d.phone);
    await page.locator('#email').nth(0).fill(d.email);
    // Đại lý: theo config (staging cần đại lý có cấu hình phí); rỗng = đại lý đầu
    if (CONTRACT.agent) await this.selSearch('agentId', CONTRACT.agent);
    else await this.selFirst('agentId');
    await this.selFirst('services');
    await this.selFirst('headquartersProvince');
    await this.selFirst('headquartersWard');
    await page.fill('#headquartersAddress', d.addr);
    await this.setDate(0, '01/01/2020');

    // --- Người đại diện ---
    await page.fill('#name', d.repName);
    await this.selFirst('gender');
    await this.setDate(1, '01/01/1990');
    await page.locator('#phoneNumber').nth(1).fill(d.repPhone);
    await page.locator('#email').nth(1).fill(d.repEmail);
    await page.fill('#identityNumber', d.cccd);
    await this.setDate(2, '01/01/2020');
    await this.selFirst('identityPlace');
    await this.setDate(3, '01/01/2035');
    await this.selTitle('nationality', 'Việt Nam');
    await this.selFirst('permanentProvince');
    await this.selFirst('permanentWard');
    await page.fill('#permanentAddress', d.addr);
    await this.selFirst('currentProvince');
    await this.selFirst('currentWard');
    await page.fill('#currentAddress', d.addr);
    await page.locator('.ant-checkbox-wrapper input[type=checkbox]').first().check().catch(() => {});
  }

  /** Mở popup gửi thẩm định, upload hồ sơ, gửi. */
  async submitAppraisal(d: MerchantData) {
    const page = this.page;
    // --- Gửi thẩm định: upload hồ sơ trong modal ---
    await page.getByRole('button', { name: 'Tạo & gửi thẩm định' }).click();
    const modal = page.locator('.ant-modal');
    // Bảng hồ sơ BẮT BUỘC (bảng đầu chứa "ĐKKD mặt trước"); upload theo NHÃN dòng cho ổn định
    // (số dòng/thứ tự khác nhau theo cấu hình; tránh ô file ở bảng ẩn khác → hết timeout).
    const reqTable = modal.locator('table').filter({ hasText: 'ĐKKD mặt trước' }).first();
    await reqTable.waitFor();
    // Upload LẦN LƯỢT mọi dòng còn ô "Tải file": dòng nào upload xong thì ô file biến mất
    // (đổi thành link file), nên cứ lấy dòng đầu còn ô file → upload → lặp tới khi hết.
    const pendingRows = () => reqTable.locator('tbody tr').filter({ has: page.locator('input[type=file]') });
    for (let guard = 0; guard < 10 && (await pendingRows().count()) > 0; guard++) {
      const r = pendingRows().first();
      await r.locator('input.ant-input').first().fill(`HS-${d.code}`).catch(() => {});
      await r.locator('input[type=file]').setInputFiles(PNG);
      await page.waitForTimeout(400);
    }
    // Chờ nút bật (file upload xong) thay vì chờ cứng → hết flaky
    const submit = modal.getByRole('button', { name: 'Gửi thẩm định' });
    await expect(submit).toBeEnabled({ timeout: 30000 });
    await submit.click();
    await page.waitForURL('**/merchant', { timeout: 30000 });
  }
}
