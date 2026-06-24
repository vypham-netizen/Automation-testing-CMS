import { BasePage } from '../BasePage';

/**
 * [SCAFFOLD v2.0 — màn CHƯA build]
 * Module 6: Quản lý Thanh toán bổ sung - TTBS (FR-29..FR-32). Loại: theo GD / theo số tiền.
 */
export class TTBSPage extends BasePage {
  async goto() { await this.page.goto('/reconciliation/supplementary'); } // TODO route

  async filter(_opts: Record<string, string>) { throw new Error('TODO v2.0'); }            // FR-29
  async taoYeuCau(_loai: 'theoGD' | 'theoSoTien', _data: object) { throw new Error('TODO v2.0'); } // FR-30 (sửa/huỷ khi Mới)
  async suaYeuCau(_id: string, _data: object) { throw new Error('TODO v2.0'); }
  async huyYeuCau(_id: string) { throw new Error('TODO v2.0'); }
  async xemChiTiet(_id: string) { throw new Error('TODO v2.0'); }                            // FR-32
}
