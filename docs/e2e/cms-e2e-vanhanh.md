# E2E — Module Danh sách yêu cầu Vận hành xử lý (CMS v1.5)

> **Phạm vi:** E2E nội bộ module "Yêu cầu Vận hành (VH) xử lý" (FR-18, FR-19).
> **Đường dẫn:** menu **Yêu cầu Vận hành xử lý**.
> **Rule:** hàng đợi các yêu cầu chờ VH xử lý: Thay đổi TK thanh toán · Cấp bổ sung TID · Thay đổi phí · Thanh lý. **Chỉ yêu cầu KÝ TAY mới cần VH xử lý tiếp**; yêu cầu ký điện tử khi đủ đối tượng ký → mặc định **Đã tiếp nhận** (vẫn hiển thị).
> Tác giả: Vy (QC) · Cập nhật: 18/06/2026

**Trạng thái xử lý:** Chờ tiếp nhận · Đang xử lý · Đã tiếp nhận · Từ chối

---

## 🟢 MAIN FLOWS (trong module)

| ID | Luồng | Tiền đề | Các bước chính | Kết quả mong đợi | Priority |
|----|-------|---------|----------------|------------------|----------|
| VH-M01 | Xem danh sách yêu cầu VH xử lý | Có quyền Xem | Mở menu Yêu cầu Vận hành xử lý | Danh sách hiển thị; mặc định lọc Trạng thái = **Chờ tiếp nhận**; 10 bản ghi/trang (đổi được); mới nhất lên đầu; đủ cột (STT, Ngày YC, TT Merchant, Loại YC, TT cũ/mới, Tài liệu, Ngày hiệu lực, Trạng thái, Người/Ngày xử lý, Nội dung xử lý, Xử lý, Lịch sử) | High |
| VH-M02 | Lọc theo Loại yêu cầu | Có dữ liệu | Mở dropdown Loại yêu cầu → chọn từng loại | Mặc định "Tất cả"; lọc đúng (Thay đổi TK / thay đổi phí / cấp bổ sung TID / thanh lý / khác) | High |
| VH-M03 | Lọc theo Trạng thái | Có dữ liệu | Mở dropdown Trạng thái → chọn từng trạng thái | Mặc định "Chờ tiếp nhận"; lọc đúng (Tất cả/Chờ tiếp nhận/Đang xử lý/Đã tiếp nhận/Từ chối) | High |
| VH-M04 | Tìm kiếm tương đối | Có dữ liệu | Nhập (copy/paste được) Tên MC / TID / MID / tên viết tắt | Lọc bản ghi khớp tương đối | Medium |
| VH-M05 | **Xử lý → Đã tiếp nhận** | Yêu cầu Chờ tiếp nhận (ký tay) | Xử lý → Trạng thái = Đã tiếp nhận → nhập ghi chú + Ngày hiệu lực + Upload file → Xác nhận | Cập nhật trạng thái VH văn bản = **Đã tiếp nhận**; lưu Ngày hiệu lực + file; ghi lịch sử xử lý; nếu đổi TK / bs TID → **log thêm vào lịch sử thay đổi TID** | High |
| VH-M06 | **Xử lý → Từ chối** | Yêu cầu Chờ tiếp nhận/Đang xử lý | Xử lý → Trạng thái = Từ chối → nhập lý do (≥5 ký tự) → Xác nhận | Cập nhật trạng thái VH văn bản = **Từ chối**; ghi lịch sử | High |
| VH-M07 | Xử lý → Đang xử lý | Yêu cầu Chờ tiếp nhận | Xử lý → Trạng thái = Đang xử lý → (ghi chú) → Xác nhận | Trạng thái = Đang xử lý; nút Xử lý vẫn còn để xử lý tiếp | Medium |
| VH-M08 | Xem Lịch sử xử lý | Bản ghi đã có lịch sử | Nhấn icon Lịch sử xử lý | Popup: STT, Thời gian (hh:mm dd/MM/yyyy), Người xử lý, Trạng thái, Ghi chú (Xem thêm/Thu gọn); mới nhất lên đầu, 10/trang | Medium |
| VH-M09 | Xem thêm / Thu gọn nội dung dài | TT cũ/mới >500 hoặc nội dung xử lý >100 ký tự | Nhấn Xem thêm / Rút gọn | Hiển thị đầy đủ / thu gọn đúng | Low |
| VH-M10 | Tài liệu đính kèm | Yêu cầu có file đính kèm | Mở/tải tài liệu đính kèm | Hiển thị & tải được file | Low |

---

## 🟠 EDGE CASES (trong module)

| ID | Luồng | Tiền đề | Các bước chính | Kết quả mong đợi | Priority |
|----|-------|---------|----------------|------------------|----------|
| VH-E01 | Bỏ trống Trạng thái xử lý | Popup Xử lý | Không chọn trạng thái → Xác nhận | Báo lỗi **"Vui lòng chọn trạng thái xử lý"** | High |
| VH-E02 | Bỏ trống Ghi chú (Đang xử lý) | Trạng thái = Đang xử lý | Để trống ghi chú → Xác nhận | Báo lỗi **"Vui lòng nhập nội dung"** | Medium |
| VH-E03 | Nội dung < 5 ký tự | Popup Xử lý | Nhập ghi chú < 5 ký tự | Báo lỗi **"Nhập tối thiểu 5 ký tự"** | Medium |
| VH-E04 | Bỏ trống Lý do từ chối | Trạng thái = Từ chối | Để trống lý do → Xác nhận | Báo lỗi **"Vui lòng nhập lý do từ chối"** | High |
| VH-E05 | Lý do từ chối < 5 ký tự | Trạng thái = Từ chối | Nhập lý do < 5 ký tự | Báo lỗi **"Nhập tối thiểu 5 ký tự"** | Medium |
| VH-E06 | Bỏ trống Ngày hiệu lực | Popup Xử lý | Không chọn ngày hiệu lực → Xác nhận | Báo lỗi **"Vui lòng chọn ngày hiệu lực"** | High |
| VH-E07 | Upload file sai định dạng / quá dung lượng | Popup Xử lý | Upload file ≠ pdf/png/jpg hoặc >15MB | Chặn (chỉ pdf/png/jpg, <15MB) | Medium |
| VH-E08 | Nút Xử lý ẩn theo trạng thái | Yêu cầu Đã tiếp nhận / Từ chối | Quan sát cột Xử lý | Nút Xử lý **chỉ hiện** với Chờ tiếp nhận / Đang xử lý | Medium |
| VH-E09 | Tìm kiếm không có kết quả | — | Nhập từ khoá không tồn tại | Thông báo **"Không tìm thấy dữ liệu hợp lệ"** | Medium |
| VH-E10 | Yêu cầu ký điện tử (đủ ký) | Yêu cầu ký điện tử đã ký đủ | Quan sát danh sách | Mặc định **Đã tiếp nhận** (không cần VH xử lý tiếp), vẫn hiển thị | Medium |
| VH-E11 | Đóng popup không lưu | Đang nhập trong popup Xử lý | Nhập dở → Đóng | Đóng popup, **không lưu** thông tin | Low |
| VH-E12 | Nút Xác nhận disable khi thiếu dữ liệu | Popup Xử lý | Quan sát nút Xác nhận khi chưa đủ trường | Xác nhận **disable**, chỉ active khi đủ dữ liệu | Medium |

---

## 🔗 Integration modules
- Yêu cầu vào hàng đợi này **từ các văn bản ký tay** (module Văn bản): đổi TK / đổi phí / cấp bổ sung TID / thanh lý ký tay → tạo bản ghi "Chờ tiếp nhận".
- Sau VH "Đã tiếp nhận" + ngày hiệu lực → văn bản có hiệu lực; đổi TK / bs TID → **log lịch sử thay đổi TID** (module TID/MID).

## ❓ Hỏi BA (VH xử lý)
1. Ghi chú: spec ghi mâu thuẫn — "Bắt buộc với Từ chối, Đang xử lý" nhưng ngay dưới "Không bắt buộc với trạng thái Đang xử lý". → Ghi chú có bắt buộc khi Đang xử lý không?
2. Trạng thái "Đã tiếp nhận" trong popup có yêu cầu Ngày hiệu lực + Upload file bắt buộc giống nhau cho mọi loại yêu cầu?
3. Loại "khác" trong dropdown Loại yêu cầu gồm những gì?
