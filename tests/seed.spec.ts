import { test } from '@playwright/test';
import { MerchantCreatePage } from '../pages/MerchantCreatePage';
import { DocumentAppraisalPage } from '../pages/DocumentAppraisalPage';
import { ContractCreatePage } from '../pages/ContractCreatePage';
import { buildMerchants } from '../data/merchantData';
import { CMS_TOKEN as TOKEN, TEST_ENV } from '../config/env';

const COUNT = parseInt(process.env.SEED_COUNT || '5', 10);

/**
 * Seed dữ liệu: tạo COUNT merchant, mỗi merchant đi đủ 3 bước nghiệp vụ.
 * Chi tiết thao tác nằm trong các Page Object (pages/*). Test chỉ "kể chuyện".
 *   1) MerchantCreatePage.create      — tạo MC + gửi thẩm định
 *   2) DocumentAppraisalPage.approve  — thẩm định → Đạt
 *   3) ContractCreatePage.createManualSigning — tạo hợp đồng ký tay
 */
test('seed merchants + contracts', async ({ page, context }) => {
  test.skip(!TOKEN, `Thiếu token cho môi trường ${TEST_ENV} trong .env`);
  console.log(`\n### SEED trên môi trường: ${TEST_ENV} ###`);
  await context.addInitScript((t) => localStorage.setItem('token', JSON.stringify(t)), TOKEN);

  const merchantPage = new MerchantCreatePage(page);
  const appraisalPage = new DocumentAppraisalPage(page);
  const contractPage = new ContractCreatePage(page);

  const merchants = buildMerchants(COUNT);
  for (const d of merchants) {
    console.log(`\n=== [${d.index}/${COUNT}] ${d.name} ===`);

    await merchantPage.create(d);
    console.log('  → merchant created');

    await appraisalPage.approve(d.name);
    console.log('  → hồ sơ Đạt');

    await contractPage.createManualSigning(d);
    console.log(`  ✓ HỢP ĐỒNG XONG: ${d.name}`);
  }
  console.log(`\n=== DONE: ${COUNT} merchant + ${COUNT} hợp đồng ===`);
});
