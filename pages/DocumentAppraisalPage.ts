import { BasePage } from './BasePage';

/**
 * Page Object: màn Thẩm định hồ sơ.
 * Đường dẫn: /document-appraisal
 */
export class DocumentAppraisalPage extends BasePage {
  /**
   * Thẩm định hồ sơ của 1 merchant về kết quả "Đạt".
   * @param merchantName tên merchant để tìm đúng dòng cần thẩm định.
   */
  async approve(merchantName: string) {
    const page = this.page;

    await page.goto('/document-appraisal');
    await page.locator('tr', { hasText: merchantName }).first()
      .getByRole('button', { name: 'Thẩm định hồ sơ' }).click();
    await page.waitForURL('**/document-appraisal/**');
    await page.waitForTimeout(700);

    // Mỗi mục hồ sơ có 1 droplist kết quả → chọn "Đạt" cho tất cả (tối đa 12 mục).
    for (let g = 0; g < 12; g++) {
      const pending = page.locator('.ant-select').filter({ hasText: /Chọn -|-Chọn-/ }).first();
      if (await pending.count() === 0) break;
      const dd = await this.openDropdown(pending);
      const titles = await dd.locator('.ant-select-item-option').allInnerTexts();
      const pick = titles.find(t => t.trim() === 'Đạt')
        ? 'Đạt'
        : (titles.find(t => /Hồ sơ đạt/.test(t)) ? 'Hồ sơ đạt' : null);
      if (pick) await dd.locator('.ant-select-item-option', { hasText: pick }).first().click();
      else { await page.keyboard.press('Escape'); break; }
    }

    await page.getByRole('button', { name: 'Đánh giá' }).click();
    await page.getByRole('dialog').getByRole('button', { name: 'Xác nhận' }).click();
    await page.waitForURL('**/document-appraisal', { timeout: 30000 });
  }
}
