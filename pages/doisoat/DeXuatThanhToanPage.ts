import { BasePage } from '../BasePage';

/**
 * [SCAFFOLD v2.0 — màn CHƯA build]
 * Module 3: Đề xuất thanh toán / Settlement (FR-17..FR-19).
 */
export class DeXuatThanhToanPage extends BasePage {
  async goto() { await this.page.goto('/reconciliation/settlements'); } // TODO route

  async filter(_opts: Record<string, string>) { throw new Error('TODO v2.0'); } // FR-17
  async xemChiTiet(_dxttId: string) { throw new Error('TODO v2.0'); }            // FR-18 (công thức tiền/TID)
  async exportReport(_dxttId: string) { throw new Error('TODO v2.0'); }
  // FR-19 KT cập nhật trạng thái TID (Đã thanh toán/Lỗi/Huỷ) → cascade GD/hold/TT/TTBS/ca
  async capNhatTrangThai(_tid: string, _trangThai: 'Đã thanh toán' | 'Lỗi' | 'Huỷ') { throw new Error('TODO v2.0'); }
}
