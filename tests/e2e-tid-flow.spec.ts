import { test, expect } from '@playwright/test';
import { MerchantCreatePage } from '../pages/MerchantCreatePage';
import { DocumentAppraisalPage } from '../pages/DocumentAppraisalPage';
import { ContractCreatePage } from '../pages/ContractCreatePage';
import { TidMidPage } from '../pages/TidMidPage';
import { buildMerchants } from '../data/merchantData';
import { CMS_TOKEN as TOKEN, TEST_ENV } from '../config/env';

/**
 * E2E luồng v1.5 đầy đủ (nối tiếp framework cũ):
 *   Merchant → Thẩm định → Hợp đồng → TID: Gửi bank  [→ Tạm hoãn → Hủy]
 *
 * Chạy: TEST_ENV=staging npm run e2e   (hoặc local)
 * Bước GỬI MAIL (Tạm hoãn/Hủy) chỉ chạy khi SEND_MAIL=1 vì nó gửi mail tới ĐẠI LÝ
 * của merchant — chỉ bật khi đại lý dùng hòm thư test (vd qctest1199@yopmail.com).
 * Import file (bank chấp nhận) + Bàn giao: cần file khớp seri runtime → để chạy tay
 * (xem docs); E2E này dừng ở Gửi bank để không phụ thuộc file động.
 */
const SEND_MAIL = process.env.SEND_MAIL === '1';

test('E2E TID flow: merchant → hợp đồng → gửi bank', async ({ page, context }) => {
  test.skip(!TOKEN, `Thiếu token môi trường ${TEST_ENV}`);
  await context.addInitScript((t) => localStorage.setItem('token', JSON.stringify(t)), TOKEN);
  console.log(`\n### E2E TID flow — môi trường: ${TEST_ENV} ###`);

  const d = buildMerchants(1)[0];
  const merchant = new MerchantCreatePage(page);
  const appraisal = new DocumentAppraisalPage(page);
  const contract = new ContractCreatePage(page);
  const tidMid = new TidMidPage(page);

  // 1) Merchant + thẩm định + hợp đồng
  await merchant.create(d);
  console.log(`  → merchant: ${d.name}`);
  await appraisal.approve(d.name);
  console.log('  → thẩm định Đạt');
  await contract.createManualSigning(d);
  console.log(`  ✓ hợp đồng (seri ${d.seri})`);

  // 2) TID: Gửi bank
  await tidMid.goto();
  await tidMid.guiBank(d.seri);
  const afterGuiBank = await tidMid.getRowState(d.seri);
  expect(afterGuiBank.tienTrinh).toContain('Gửi bank cấp TID');
  console.log(`  ✓ Gửi bank → ${afterGuiBank.tienTrinh}`);

  // 3) (tùy chọn) Tạm hoãn → Hủy — có gửi mail tới đại lý
  if (SEND_MAIL) {
    await tidMid.tamHoan(d.seri, 'QC E2E - tạm hoãn');
    expect((await tidMid.getRowState(d.seri)).trangThai).toContain('Tạm hoãn');
    console.log('  ✓ Tạm hoãn (mail đã gửi đại lý)');

    await tidMid.huy(d.seri, 'QC E2E - hủy');
    expect((await tidMid.getRowState(d.seri)).trangThai).toContain('Hủy');
    console.log('  ✓ Hủy (mail đã gửi đại lý)');
  } else {
    console.log('  (bỏ qua Tạm hoãn/Hủy — đặt SEND_MAIL=1 để chạy bước gửi mail)');
  }
});
