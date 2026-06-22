# E2E — Module Quản lý TID/MID (CMS v1.5)

> **Phạm vi:** E2E **nội bộ module Quản lý TID/MID** (mục 1.1.2.3.1 → 1.1.2.3.12).
> Tích hợp với module khác (HĐ sinh POS, Phụ lục cấp bổ sung TID, Thanh lý) **để ở tầng Integration riêng** — KHÔNG nằm trong file này.
> **Tiền đề chung:** đã có HĐ Đang hoạt động với ≥1 POS hiển thị trong Quản lý TID/MID (coi như input sẵn).
> Tác giả: Vy (QC) · Cập nhật: 18/06/2026

**Trạng thái TID:** Chưa hoạt động · Đang hoạt động · Tạm hoãn · Huỷ · Đóng
**Tiến trình:** Tiếp nhận · Gửi bank cấp TID · Bank từ chối · Bank chấp nhận · Bàn giao thiết bị BD/MC · Có PSGD · Gửi bank đóng TID · Bank phản hồi đóng TID

---

## 🟢 MAIN FLOWS (trong module)

| ID | Luồng | Chức năng | Tiền đề | Các bước chính | Kết quả mong đợi | Priority |
|----|-------|-----------|---------|----------------|------------------|----------|
| TM-M01 | **Vòng đời TID thuận (Golden)** | 3.3→3.7 | POS "Chưa hoạt động / Tiếp nhận" | Tick POS → **Gửi bank** → **Import file kết quả** (Bank chấp nhận) → **Bàn giao BD** → (PSGD) → **Gửi bank đóng TID** (import) → **Import phản hồi đóng** | TID đi đủ: Tiếp nhận→Gửi bank→Bank chấp nhận (Đang hoạt động)→Bàn giao→Có PSGD→Gửi bank đóng→**Đóng**; log lịch sử mỗi bước | High |
| TM-M02 | Bank từ chối → gửi lại | 3.3, 3.4 | POS đã Gửi bank | Import file kết quả = **Bank từ chối** → sửa/gửi lại bank → Import lại = chấp nhận | Lần từ chối: trạng thái giữ "Chưa hoạt động", tiến trình "Bank từ chối"; gửi lại → "Bank chấp nhận" | High |
| TM-M03 | Bàn giao BD gửi mail | 3.5 | TID "Đang hoạt động" | Tick TID → Bàn giao BD → xác nhận | Gom TID theo đại lý, gửi mail (kèm file TID/MID), tiến trình "Bàn giao thiết bị BD/MC", cập nhật thời gian bàn giao | High |
| TM-M04 | Tạm hoãn TID | 3.8 | TID Đang hoạt động | Tick TID → Tạm hoãn → nhập lý do → xác nhận | Trạng thái "Tạm hoãn", gửi mail đại lý, ghi log + thời gian tạm hoãn | High |
| TM-M05 | Hủy yêu cầu cấp TID | 3.10 | TID chưa hoàn tất | Tick TID → Hủy yêu cầu → nhập lý do → xác nhận | Trạng thái "Huỷ", gửi mail đại lý, ghi log + thời gian hủy | High |
| TM-M06 | Tạm hoãn → Hủy | 3.8→3.10 | TID Tạm hoãn | Từ TID Tạm hoãn → Hủy yêu cầu | Chuyển Tạm hoãn → Huỷ (1 chiều) | Medium |
| TM-M07 | Chỉnh sửa TID | 3.11 | TID chưa PSGD, TK Trưởng phòng | Icon Sửa → đổi TID/seri/MID + nhập lý do → xác nhận | Cập nhật thông tin, ghi log lịch sử (giá trị cũ→mới) | High |
| TM-M08 | Tra cứu / mapping TID | 3.12 | Có file TID/MID hợp lệ | Tra cứu dữ liệu TID → upload file → tạo file kết quả | Mapping đúng 3 TH (có TID / có MID / cả hai) → xuất file `KQ_TID_DDMMYYYY.xlsx` | Medium |
| TM-M09 | Xem chi tiết TID | 3.2 | Có TID | Icon Xem | Màn chi tiết (chỉ xem): thông tin TID, hợp đồng, merchant, bảng phí, TK nhận thanh toán, **lịch sử thay đổi** | High |
| TM-M10 | Danh sách: lọc + xuất excel | 3.1 | Có dữ liệu | Áp bộ lọc (trạng thái/tiến trình/đại lý/NH/ngày) → Xuất excel | Lọc đúng; file .xlsx đủ cột, tên `Danh sách TID/MID_dd/MM/yyyy`, thông báo thành công | High |

---

## 🟠 EDGE CASES (trong module)

| ID | Luồng | Chức năng | Tiền đề | Các bước chính | Kết quả mong đợi | Priority |
|----|-------|-----------|---------|----------------|------------------|----------|
| TM-E01 | Import file có dòng lỗi | 3.4 | File có ≥1 dòng sai | Import (seri trùng / TID đã tồn tại / thiếu cột / seri không có / cặp TID-NH trùng) | **Chặn toàn bộ file**; bảng lỗi theo dòng; tải được DS hợp lệ & không hợp lệ | High |
| TM-E02 | Import đóng TID — trạng thái không hợp lệ | 3.6, 3.7 | TID không ở trạng thái cho đóng | Import file đóng cho TID khác "Gửi bank đóng TID"/"Đang hoạt động" | Báo lỗi theo dòng "TID có trạng thái không hợp lệ" | High |
| TM-E03 | Chức năng disable khi chưa tick | 3.1 | Chưa tick bản ghi | Mở icon Chức năng | Gửi bank / Bàn giao / Tạm hoãn / Hủy **disable**; Import & Tra cứu vẫn dùng được | High |
| TM-E04 | Chỉnh sửa TID đã PSGD | 3.11 | TID đã phát sinh giao dịch | Mở Sửa TID | Trường TID **disable** (không cho sửa khi đã PSGD) | High |
| TM-E05 | Sửa TID trùng TID tồn tại | 3.11 | TK Trưởng phòng | Sửa TID = giá trị đã tồn tại trên hệ thống | Bị chặn (TID là duy nhất) | High |
| TM-E06 | Phân quyền chỉnh sửa | 3.11 | TK KHÔNG phải Trưởng phòng VH | Thử mở Sửa TID | Không cho sửa (chỉ Trưởng phòng VH) | Medium |
| TM-E07 | Tạm hoãn/Hủy thiếu lý do | 3.8, 3.10 | TID hợp lệ | Tạm hoãn/Hủy nhưng để trống lý do | Chặn xác nhận (lý do bắt buộc) | Medium |
| TM-E08 | Tra cứu: file thiếu TID & MID | 3.12 | File thiếu cả TID lẫn MID | Tạo file kết quả | Báo lỗi "Phải có ít nhất 1 trong 2 trường TID/MID" | Medium |
| TM-E09 | Tìm kiếm không có kết quả | 3.1 | Từ khoá không tồn tại | Nhập từ khoá lạ | Grid trống + thông báo "Không có bản ghi nào" | Medium |
| TM-E10 | Xuất excel dữ liệu quá lớn | 3.1 | Dữ liệu rất lớn, không lọc | Xuất excel | Không tải file; thông báo "Dữ liệu quá nhiều, vui lòng tìm kiếm bản ghi để xuất file" | Medium |

---

## 🔗 Để dành cho tầng INTEGRATION (file riêng sau)
- HĐ ký xong → **sinh POS/TID** vào module này (input của TM-M01).
- **Phụ lục cấp bổ sung TID** (module Văn bản) ký + hiệu lực → sinh TID mới.
- **Thanh lý** (module Thanh lý) yêu cầu **đã đóng hết TID** (output của TM-M01).
→ Các mạch nối này viết ở `cms-e2e-integration.md`.

## ❓ Hỏi BA (trong phạm vi TID/MID)
1. "Hủy" xuất hiện ở cả **Trạng thái** lẫn **Tiến trình** — tiến trình có cần "Hủy" không?
2. Bộ lọc ngày: UI là "ngày tạo POS" nhưng spec ghi "ngày cấp TID" — đúng field nào?
3. Mục 3.9 thiếu trong spec (nhảy 3.8 → 3.10).
4. Cột Thao tác: UI hiển thị "Sửa / HĐ", spec ghi "Sửa / Xem" — xác nhận.
5. Bank trả file kết quả TID qua kênh nào, đúng template import không?
