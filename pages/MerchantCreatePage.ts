import { BasePage } from './BasePage';
import { MerchantData, PNG } from '../data/merchantData';

/**
 * Page Object: màn Tạo merchant (Hộ kinh doanh) + gửi thẩm định.
 * Đường dẫn: /merchant/create
 */
export class MerchantCreatePage extends BasePage {
  /** Tạo 1 merchant hoàn chỉnh và gửi thẩm định. Kết thúc khi đã quay về /merchant. */
  async create(d: MerchantData) {
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
    await this.selFirst('agentId');
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

    // --- Gửi thẩm định: upload 4 hồ sơ trong modal ---
    await page.getByRole('button', { name: 'Tạo & gửi thẩm định' }).click();
    const modal = page.locator('.ant-modal');
    const reqTable = modal.locator('table').filter({ hasText: 'ĐKKD mặt trước' }).first();
    await reqTable.waitFor();
    // tbody dòng 0 là header; 4 dòng hồ sơ thật là nth(1..4) (vị trí cố định, không trôi khi upload)
    const allRows = reqTable.locator('tbody tr');
    for (let k = 1; k <= 4; k++) {
      const row = allRows.nth(k);
      await row.locator('input.ant-input').first().fill(`HS-${d.code}`);
      await row.locator('input[type=file]').setInputFiles(PNG);
      await page.waitForTimeout(200);
    }
    await page.waitForTimeout(400);
    await modal.getByRole('button', { name: 'Gửi thẩm định' }).click();
    await page.waitForURL('**/merchant', { timeout: 30000 });
  }
}
