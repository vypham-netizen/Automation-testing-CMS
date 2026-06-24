import { BasePage } from '../BasePage';

/**
 * [SCAFFOLD v2.0 — màn CHƯA build, route TODO]
 * Module 1: Quản lý ca đối soát (FR-1..FR-10).
 * Khi BA/Dev hoàn thiện màn đối soát, điền selector + bỏ throw.
 */
export class CaDoiSoatPage extends BasePage {
  // TODO: route thật khi deploy v2.0
  async goto() {
    await this.page.goto('/reconciliation/sessions'); // TODO xác nhận route
  }

  // FR-1 Danh sách + tìm kiếm (ca/trạng thái/ngân hàng) + xuất file
  async search(_keyword: string) { throw new Error('TODO v2.0: chưa build'); }
  async exportExcel() { throw new Error('TODO v2.0: chưa build'); }

  // FR-3 Đối soát & phân loại GD (Khớp / Chờ xử lý / Theo dõi)
  async doiSoat(_sessionId: string) { throw new Error('TODO v2.0'); }
  // FR-5 Tổng hợp / tổng hợp lại (sinh snapshot đề xuất thanh toán)
  async tongHop(_sessionId: string) { throw new Error('TODO v2.0'); }
  // FR-6 Chuyển KSV duyệt
  async chuyenKSV(_sessionId: string) { throw new Error('TODO v2.0'); }
  // FR-7 KSV huỷ ca (reset GD/hold/TT/TTBS về Mới)
  async huyCa(_sessionId: string, _lyDo: string) { throw new Error('TODO v2.0'); }
  // FR-8 KSV duyệt ca → sinh Biên bản đối soát + Giấy đề nghị thanh toán
  async duyetCa(_sessionId: string, _ngayCaThanhToan: string) { throw new Error('TODO v2.0'); }
  // FR-9 Hold / Truy thu 1 GD trong ca
  async holdGiaoDich(_gdId: string, _lyDo: string) { throw new Error('TODO v2.0'); }
  // FR-10 Xoá file import đầu vào (cascade xoá GD + ca)
  async xoaFileImport(_fileId: string) { throw new Error('TODO v2.0'); }
}
