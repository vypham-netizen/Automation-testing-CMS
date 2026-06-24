import { test, expect } from '@playwright/test';
import { MerchantCreatePage } from '../pages/MerchantCreatePage';
import { DocumentAppraisalPage } from '../pages/DocumentAppraisalPage';
import { ContractCreatePage } from '../pages/ContractCreatePage';
import { TidMidPage } from '../pages/TidMidPage';
import { buildMerchants } from '../data/merchantData';
import { CMS_TOKEN as TOKEN, TEST_ENV } from '../config/env';

/**
 * E2E luồng v1.5: Merchant → Thẩm định → Hợp đồng → TID: Gửi bank  [→ Tạm hoãn → Hủy]
 *
 * 2 chế độ chạy:
 *  - Mặc định: tạo merchant mới từ đầu rồi chạy TID. (LƯU Ý: trên staging, tạo HỢP ĐỒNG
 *    bị backend chặn "appraisal_request_file_not_uploaded" — rào nghiệp vụ ngoài UI;
 *    luồng tạo merchant/thẩm định/điền HĐ vẫn chạy tới bước submit.)
 *  - TID_SERI=<seri>: BỎ QUA tạo merchant, chạy luồng TID trực tiếp trên TID có sẵn
 *    (đại lý dùng hòm test) → path xanh để verify thao tác TID.
 *
 * Chạy: TEST_ENV=staging TID_SERI=53535 npm run e2e
 * Bước gửi mail (Tạm hoãn/Hủy) chỉ chạy khi SEND_MAIL=1.
 */
const SEND_MAIL = process.env.SEND_MAIL === '1';
const TID_SERI = process.env.TID_SERI;

test('E2E TID flow', async ({ page, context }) => {
  test.skip(!TOKEN, `Thiếu token môi trường ${TEST_ENV}`);
  await context.addInitScript((t) => localStorage.setItem('token', JSON.stringify(t)), TOKEN);
  console.log(`\n### E2E TID flow — môi trường: ${TEST_ENV} ###`);

  const tidMid = new TidMidPage(page);
  let seri: string;

  if (TID_SERI) {
    console.log(`  → Dùng TID có sẵn: seri ${TID_SERI} (bỏ qua tạo merchant)`);
    seri = TID_SERI;
  } else {
    const d = buildMerchants(1)[0];
    await new MerchantCreatePage(page).create(d);
    console.log(`  → merchant: ${d.name}`);
    await new DocumentAppraisalPage(page).approve(d.name);
    console.log('  → thẩm định Đạt');
    await new ContractCreatePage(page).createManualSigning(d);
    console.log(`  ✓ hợp đồng (seri ${d.seri})`);
    seri = d.seri;
  }

  // TID: Gửi bank
  await tidMid.goto();
  await tidMid.guiBank(seri);
  expect((await tidMid.getRowState(seri)).tienTrinh).toContain('Gửi bank cấp TID');
  console.log('  ✓ Gửi bank → Gửi bank cấp TID');

  // (tùy chọn) Tạm hoãn → Hủy — gửi mail tới đại lý
  if (SEND_MAIL) {
    await tidMid.tamHoan(seri, 'QC E2E - tạm hoãn');
    expect((await tidMid.getRowState(seri)).trangThai).toContain('Tạm hoãn');
    console.log('  ✓ Tạm hoãn (mail đã gửi đại lý)');
    await tidMid.huy(seri, 'QC E2E - hủy');
    console.log('  ✓ Hủy');
  } else {
    console.log('  (đặt SEND_MAIL=1 để chạy Tạm hoãn/Hủy gửi mail)');
  }
});
