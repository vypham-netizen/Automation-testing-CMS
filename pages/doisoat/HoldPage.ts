import { BasePage } from '../BasePage';

/**
 * [SCAFFOLD v2.0 — màn CHƯA build]
 * Module 4: Quản lý Hold (FR-21..FR-24). Loại: theo GD / theo số tiền.
 */
export class HoldPage extends BasePage {
  async goto() { await this.page.goto('/reconciliation/holds'); } // TODO route

  async filter(_opts: Record<string, string>) { throw new Error('TODO v2.0'); }            // FR-21
  async taoYeuCau(_loai: 'theoGD' | 'theoSoTien', _data: object) { throw new Error('TODO v2.0'); } // FR-22 (chỉ sửa/huỷ khi Mới)
  async suaYeuCau(_id: string, _data: object) { throw new Error('TODO v2.0'); }
  async huyYeuCau(_id: string) { throw new Error('TODO v2.0'); }
  async nhaHold(_holdId: string, _soTien: number, _ngay: string, _ca: string) { throw new Error('TODO v2.0'); } // FR-24 nhả từng phần
}
