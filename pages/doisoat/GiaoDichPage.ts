import { BasePage } from '../BasePage';

/**
 * [SCAFFOLD v2.0 — màn CHƯA build]
 * Module 2: Quản lý giao dịch (FR-11..FR-16).
 */
export class GiaoDichPage extends BasePage {
  async goto() { await this.page.goto('/reconciliation/transactions'); } // TODO route

  async filter(_opts: Record<string, string>) { throw new Error('TODO v2.0'); } // FR-11
  async exportExcel() { throw new Error('TODO v2.0'); }
  async xemChiTiet(_gdId: string) { throw new Error('TODO v2.0'); }            // FR-12
  async themBaoCoBaoNo(_gdId: string, _loai: 'baoCo' | 'baoNo') { throw new Error('TODO v2.0'); } // FR-13
  async suaGiaoDich(_gdId: string) { throw new Error('TODO v2.0'); }           // FR-15 (tính lại phí + đối soát lại)
}
