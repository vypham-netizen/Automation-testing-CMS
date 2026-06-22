# E2E — Module Thẩm định phụ lục hợp đồng (CMS v1.5)

> **Phạm vi:** E2E nội bộ module Thẩm định phụ lục hợp đồng (QTRR thẩm định).
> **Đường dẫn:** Menu **Thẩm định hồ sơ, phụ lục** → **Thẩm định phụ lục hợp đồng**.
> **Rule:** chỉ phụ lục **Yêu cầu cấp bổ sung TID** mới vào hàng đợi thẩm định. Chuỗi ký: **MC ký → QTRR thẩm định → GtelPay (giám đốc) ký**. Bản ghi xuất hiện ở Grid **sau khi MC ký phụ lục thành công**.
> Tác giả: Vy (QC) · Cập nhật: 18/06/2026

**Vai trò:** QTRR = thẩm định · GtelPay = giám đốc ký số
**Quyền yêu cầu:** Xem · Thẩm định phụ lục
**Trạng thái thẩm định:** Chờ thẩm định · Đạt · Không đạt

---

## 🟢 MAIN FLOWS (trong module)

| ID | Luồng | Tiền đề | Các bước chính | Kết quả mong đợi | Priority |
|----|-------|---------|----------------|------------------|----------|
| TD-M01 | Xem danh sách phụ lục chờ thẩm định | Có quyền Xem | Mở menu Thẩm định phụ lục hợp đồng | Hiển thị Grid; đủ cột (STT, Ngày yêu cầu, Số phụ lục HĐ, TT merchant, Loại yêu cầu, Trạng thái, Thao tác); ô đếm **"Chờ thẩm định"** hiển thị số lượng **màu đỏ** | High |
| TD-M02 | Tìm kiếm theo Tên merchant | Có dữ liệu | Nhập (tương đối) tên merchant | Lọc bản ghi khớp tương đối; cho nhập không giới hạn loại ký tự | Medium |
| TD-M03 | Lọc theo khoảng Ngày yêu cầu | Có dữ liệu | Chọn Từ ngày – Đến ngày (DD/MM/YYYY, chọn lịch) | Lọc theo ngày MC ký phụ lục thành công | Medium |
| TD-M04 | Lọc theo Trạng thái | Có dữ liệu | Mở droplist Trạng thái → chọn | Droplist: Tất cả / Chờ thẩm định / Đạt / Không đạt; lọc đúng | High |
| TD-M05 | **Thẩm định → Đạt** | Bản ghi Chờ thẩm định | Nhấn **Thẩm định** → popup → Kết quả = **Đạt** → Xác nhận | Trạng thái ký phụ lục → **Chờ GtelPay ký**; gửi mail thông báo lãnh đạo; phụ lục hiển thị ở DS Chờ GtelPay ký; ghi lịch sử xử lý hợp đồng | High |
| TD-M06 | **Thẩm định → Không đạt** | Bản ghi Chờ thẩm định | Nhấn Thẩm định → Kết quả = **Không đạt** → nhập **Lý do** → Xác nhận | Trạng thái hiệu lực phụ lục → **Huỷ**; trạng thái ký → **Không đạt**; ghi lịch sử xử lý hợp đồng | High |
| TD-M07 | Tải xuống file phụ lục | Đang mở popup thẩm định/xem | Nhấn **Tải xuống** | Hệ thống tải file phụ lục | Low |
| TD-M08 | Preview nội dung phụ lục | Đang mở popup | Quan sát vùng Preview | Hiển thị nội dung file phụ lục | Medium |
| TD-M09 | Xem lại phụ lục đã thẩm định | Bản ghi Đạt / Không đạt | Nhấn **Xem** | Mở popup xem văn bản phụ lục (chỉ xem, không nhập kết quả) | Medium |
| TD-M10 | Đóng popup | Đang mở popup | Nhấn **Đóng** | Đóng popup, không thay đổi dữ liệu | Low |

---

## 🟠 EDGE CASES (trong module)

| ID | Luồng | Tiền đề | Các bước chính | Kết quả mong đợi | Priority |
|----|-------|---------|----------------|------------------|----------|
| TD-E01 | Bỏ trống Kết quả thẩm định | Popup thẩm định | Không chọn Kết quả → Xác nhận | Chặn (Kết quả thẩm định bắt buộc) | High |
| TD-E02 | Không đạt nhưng bỏ trống Lý do | Kết quả = Không đạt | Để trống Lý do → Xác nhận | Chặn (Lý do bắt buộc khi Không đạt) | High |
| TD-E03 | Lý do ẩn/hiện theo kết quả | Popup thẩm định | Chọn Đạt rồi đổi sang Không đạt | Đạt → ẩn Lý do; Không đạt → hiện Lý do | Medium |
| TD-E04 | Button Thẩm định chỉ khi Chờ thẩm định | Bản ghi đã Đạt/Không đạt | Quan sát cột Thao tác | Bản ghi đã thẩm định: **không** có nút Thẩm định, chỉ có **Xem** | High |
| TD-E05 | Button Xem chỉ khi đã thẩm định | Bản ghi Chờ thẩm định | Quan sát cột Thao tác | Bản ghi Chờ thẩm định: chỉ có **Thẩm định**, **không** có Xem | Medium |
| TD-E06 | Nhập sai định dạng ngày | Bộ lọc ngày | Nhập ngày sai định dạng | Thông báo **"Ngày không đúng định dạng"** | Medium |
| TD-E07 | Tìm kiếm không có kết quả | — | Nhập tên merchant không tồn tại | Grid trống / thông báo không có dữ liệu | Medium |
| TD-E08 | Phân quyền thẩm định | TK không có quyền Thẩm định phụ lục | Truy cập menu / nhấn Thẩm định | Không truy cập / ẩn nút Thẩm định (chỉ xem nếu có quyền Xem) | High |
| TD-E09 | Ký/thẩm định hàng loạt: chọn 0 bản ghi | Có tickbox chọn hàng loạt | Không tick bản ghi nào → thực hiện hàng loạt | Chặn (tối thiểu 1 bản ghi) — **hỏi BA** | Medium |
| TD-E10 | Chỉ phụ lục cấp bổ sung TID vào hàng đợi | Có phụ lục đổi phí / đổi TK | Quan sát danh sách | Chỉ phụ lục **Yêu cầu bổ sung TID** hiển thị (đổi phí/đổi TK không vào màn thẩm định) | High |
| TD-E11 | Bản ghi chỉ xuất hiện sau khi MC ký | Phụ lục chưa được MC ký | Quan sát danh sách | Phụ lục chưa MC ký **không** xuất hiện ở hàng đợi thẩm định | High |

---

## 🔗 Integration modules
- **Đầu vào:** phụ lục **cấp bổ sung TID** sau khi **MC ký thành công** (module Văn bản) → tạo bản ghi "Chờ thẩm định".
- **Đạt** → đẩy phụ lục sang **Ký số** (Chờ GtelPay ký) → GtelPay ký + hiệu lực → **sinh TID mới** (module TID/MID).
- **Không đạt** → phụ lục **Huỷ** (không sinh TID).

## ❓ Hỏi BA (Thẩm định)
1. Tiêu đề spec ghi **"KÝ SỐ VĂN BẢN"** nhưng nội dung là **thẩm định** — nhầm tiêu đề?
2. Màn thẩm định có **tickbox "ký hàng loạt"** + ô "Chờ thẩm định" — QTRR có thẩm định **hàng loạt** không? Nếu có, kết quả Đạt/Không đạt + Lý do áp cho cả lô thế nào (cùng 1 kết quả hay từng cái)?
3. Phụ lục **Không đạt → Huỷ**: MC có được tạo lại phụ lục cấp bổ sung TID mới không?
4. Ngoài "Yêu cầu cấp bổ sung TID", còn loại phụ lục nào cần QTRR thẩm định không?
