import { BasePage } from './BasePage';
import { MerchantData } from '../data/merchantData';
import { CONTRACT } from '../config/env';

/**
 * Page Object: màn Tạo hợp đồng (phương thức Ký tay).
 * Vào từ: /merchant → menu "..." của merchant → Tạo hợp đồng.
 */
export class ContractCreatePage extends BasePage {
  /** Tạo hợp đồng ký tay cho merchant `d`. Kết thúc khi đã quay về /contracts. */
  async createManualSigning(d: MerchantData) {
    const page = this.page;

    // Vào màn tạo hợp đồng từ menu "..." của merchant
    await page.goto('/merchant');
    await page.locator('tr', { hasText: d.name }).first().getByLabel('more').click();
    await page.locator('.ant-dropdown:not(.ant-dropdown-hidden)').getByText('Tạo hợp đồng').click();
    await page.waitForURL('**/contracts/create/**');
    await page.locator('#bankId').waitFor();

    // --- Thông tin hợp đồng (bank/ngành theo môi trường — config/env.ts) ---
    // Lưu ý: bank+ngành phải là tổ hợp đại lý của merchant CÓ cấu hình phí,
    // nếu không bảng "Phí dịch vụ" trống → nút Tạo hợp đồng disable.
    await this.selSearch('bankId', CONTRACT.bank);
    await this.selSearch('professionId', CONTRACT.profession);
    await this.selText('signingMethod', CONTRACT.signingMethod);
    // Bảng phí tự điền theo mốc phí đại lý (đã hợp lệ); không cần nhập tay.

    // --- 1 máy POS ---
    await page.fill('#numberOfTerminal', '1');
    await page.locator('#terminals_0_seri').waitFor();
    await page.fill('#terminals_0_seri', d.seri);
    await page.fill('#terminals_0_type', 'POS');
    await page.fill('#terminals_0_shortName', `QCPOS${d.index}`);
    await page.fill('#terminals_0_address', d.addr);
    await page.fill('#terminals_0_email', d.terminalEmail);

    // --- Thêm + chọn tài khoản nhận tiền ---
    const accSel = page.locator('.ant-select').filter({ hasText: 'Chọn tài khoản' }).first();
    await this.selText(accSel, 'Thêm mới tài khoản');
    const accModal = page.locator('.ant-modal');
    // Họ tên (chủ TK) hệ thống tự điền & disabled — chỉ điền Số TK + Ngân hàng
    await accModal.getByPlaceholder('Nhập số tài khoản').fill(d.account);
    // Chọn Ngân hàng trong modal — KHÔNG Escape (sẽ đóng modal)
    await accModal.locator('.ant-select').first().locator('.ant-select-selector').click({ force: true });
    await page.waitForTimeout(400);
    const bankDd = page.locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)').last();
    const bankOpt = bankDd.locator('.ant-select-item-option').first();
    await bankOpt.waitFor({ state: 'visible' });
    await bankOpt.scrollIntoViewIfNeeded().catch(() => {});
    await bankOpt.click();
    await accModal.getByRole('button', { name: 'Thêm tài khoản' }).click();
    await page.waitForTimeout(600);
    const accSel2 = page.locator('.ant-select').filter({ hasText: /Thêm mới tài khoản|Chọn tài khoản/ }).first();
    await this.selText(accSel2, d.account);

    // --- Tạo ---
    await page.getByRole('button', { name: 'Tạo hợp đồng' }).click();
    // Bấm Xác nhận trên dialog confirm ĐANG HIỂN THỊ (tránh modal ẩn khác trong DOM)
    const confirmContent = page.locator('.ant-modal-content:visible').filter({ hasText: 'Xác nhận tạo hợp đồng' });
    const confirmBtn = confirmContent.locator('button:has-text("Xác nhận")').last();
    await confirmBtn.waitFor({ state: 'visible' });
    await confirmBtn.click();
    // Tạo xong → dialog confirm đóng (đáng tin hơn chờ URL vì đích khác nhau theo môi trường)
    await confirmContent.waitFor({ state: 'hidden', timeout: 30000 });
    await page.waitForTimeout(1000);
  }
}
