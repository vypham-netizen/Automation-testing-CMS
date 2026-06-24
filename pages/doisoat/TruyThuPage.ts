import { BasePage } from '../BasePage';

/**
 * [SCAFFOLD v2.0 — màn CHƯA build]
 * Module 5: Quản lý Truy thu - TT (FR-25..FR-28). Loại: theo GD / theo số tiền.
 */
export class TruyThuPage extends BasePage {
  async goto() { await this.page.goto('/reconciliation/recovery'); } // TODO route

  async filter(_opts: Record<string, string>) { throw new Error('TODO v2.0'); }            // FR-25
  async taoYeuCau(_loai: 'theoGD' | 'theoSoTien', _data: object) { throw new Error('TODO v2.0'); } // FR-26 (sửa/xoá khi Mới)
  async suaYeuCau(_id: string, _data: object) { throw new Error('TODO v2.0'); }
  async xoaYeuCau(_id: string) { throw new Error('TODO v2.0'); }
  async xemChiTiet(_id: string) { throw new Error('TODO v2.0'); }                            // FR-28
}
