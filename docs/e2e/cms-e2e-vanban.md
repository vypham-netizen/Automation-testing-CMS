# E2E — Module Quản lý văn bản (CMS v1.5)

> **Phạm vi:** E2E **nội bộ module Quản lý văn bản** (phụ lục, giấy ủy quyền, biên bản — phần Tạo/Sửa/Hủy/Gửi lại/Gen file/Xem chi tiết).
> Tích hợp xuyên module (sinh TID từ phụ lục cấp TID, thanh lý...) **để ở tầng Integration riêng**.
> **Đường dẫn:** Danh sách hợp đồng → Xem → Chi tiết hợp đồng → **Quản lý văn bản**.
> Tác giả: Vy (QC) · Cập nhật: 18/06/2026

**Vai trò:** MC = đại diện Merchant · BD = kinh doanh · QTRR = thẩm định · GtelPay = Giám đốc ký số · VH = vận hành
**Loại văn bản:** PL đổi TK · PL đổi phí · PL cấp bổ sung TID · GUQ NNUQ · GUQ người đại diện MC · Biên bản thanh lý

---

## 🟢 MAIN FLOWS (trong module)

| ID | Luồng | Tiền đề | Các bước chính | Kết quả mong đợi | Priority |
|----|-------|---------|----------------|------------------|----------|
| VB-M01 | Tạo PL đổi TK (chủ TK = Merchant) — ký điện tử | HĐ Đang hoạt động, ký điện tử | Tạo văn bản → Loại yêu cầu "Thay đổi TK" → Người nhận = Merchant → chọn Seri POS-TID + STK → Xác nhận | Sinh phụ lục, trạng thái ký "Chờ MC ký", gửi mail link cho MC | High |
| VB-M02 | Tạo PL đổi TK (Merchant) — ký tay | HĐ Đang hoạt động, ký tay | Tạo → chọn POS-TID + STK → Xác nhận | Trạng thái ký "Ký tay", VH "Chờ tiếp nhận"; sinh 1 bản ghi ở màn Yêu cầu VH xử lý | High |
| VB-M03 | Tạo GUQ đổi TK (người đại diện MC) | HĐ Đang hoạt động | Tạo → Người nhận = người đại diện MC → POS-TID + STK → Xác nhận | Sinh GUQ, chuỗi ký **BD → MC**; hồ sơ không cần thẩm định | High |
| VB-M04 | Tạo GUQ đổi TK (NNUQ) | HĐ Đang hoạt động, có NNUQ | Tạo → Người nhận = NNUQ → chọn CCCD (Đạt/Chưa TĐ) + STK NNUQ → Xác nhận | Sinh GUQ; nếu hồ sơ NNUQ chưa TĐ → "Chờ thẩm định"; sau Đạt → **BD → NNUQ → MC** | High |
| VB-M05 | Tạo PL cấp bổ sung TID (PL03) 🔗 | HĐ Đang hoạt động | Tạo → Loại "Cấp bổ sung TID" → nhập Số lượng (1–10) → khai POS (seri/loại máy/tên viết tắt/địa chỉ) → Xác nhận | Sinh phụ lục 03, chuỗi **MC ký → QTRR thẩm định → GtelPay ký**; hiệu lực → sinh TID mới | High |
| VB-M06 | Tạo PL đổi phí | HĐ Đang hoạt động | Tạo → Loại "Thay đổi phí" → sửa ≥1 loại phí (≥ mốc) → Xác nhận | Sinh PL đổi phí, **MC ký → GtelPay ký** | Medium |
| VB-M07 | Sửa văn bản | Văn bản trạng thái Nháp / chưa ai ký | Thao tác → Sửa → đổi thông tin → Xác nhận | Ghi nhận thông tin mới thay cũ; trường Loại yêu cầu disable | Medium |
| VB-M08 | Gửi lại email ký | Văn bản "Chờ MC ký"/"Chờ NNUQ ký", link hết hạn | Thao tác → Gửi lại email ký → Xác nhận | Gửi lại mail link ký (email MC / người đại diện / NNUQ) | Medium |
| VB-M09 | Hủy văn bản | Văn bản Nháp / chưa ai ký | Thao tác → Hủy → Xác nhận | Cập nhật trạng thái hiệu lực = **Hủy** (màu xám) | Medium |
| VB-M10 | Xem chi tiết — popup TK gắn TID | Văn bản đổi TK / GUQ | Thao tác → Xem chi tiết | Popup danh sách TK gắn TID: số lượng, TID, seri, STK (format), email đối soát, trạng thái hiệu lực (xanh/đỏ); scroll mới→cũ | High |
| VB-M11 | Gen lại file | File văn bản gen lỗi | Thao tác → Gen lại file | Hệ thống gen lại file văn bản tương ứng | Medium |
| VB-M12 | Danh sách: lọc theo Loại văn bản | Có dữ liệu | Mở droplist Loại văn bản → chọn nhóm/loại | Lọc đúng theo loại; mặc định "Tất cả"; 20 bản ghi/trang, mới nhất lên đầu | Medium |

---

## 🟠 EDGE CASES (trong module)

| ID | Luồng | Tiền đề | Các bước chính | Kết quả mong đợi | Priority |
|----|-------|---------|----------------|------------------|----------|
| VB-E01 | Tạo văn bản khi HĐ chưa Đang hoạt động | HĐ ≠ Đang hoạt động | Tạo bất kỳ loại văn bản | Trạng thái ký = **Nháp**, **không** gửi mail ký | High |
| VB-E02 | Đổi TK: POS đang có yêu cầu chờ duyệt | POS có yêu cầu đổi TK chờ duyệt | Mở droplist Seri POS-TID | POS đó **disable** không cho chọn (chống tạo trùng) | High |
| VB-E03 | STK: tài khoản gần nhất đã gắn POS | POS đã gắn 1 TK | Mở droplist STK | TK gần nhất **disable** không cho chọn lại | Medium |
| VB-E04 | MC là Tổ chức | MC loại Tổ chức | Loại yêu cầu = Thay đổi TK → mở "Người nhận thanh toán" | **Disable** NNUQ & người đại diện MC (chỉ Merchant) — *hỏi BA luồng tổ chức* | High |
| VB-E05 | NNUQ: CCCD trạng thái không hợp lệ | NNUQ có GUQ trạng thái ≠ Đạt/Chưa TĐ | Mở droplist CCCD | Các CCCD trạng thái khác **disable** không cho chọn | Medium |
| VB-E06 | Cấp TID: số lượng ngoài 0–10 | — | Nhập Số lượng TID > 10 hoặc ký tự | Chặn (chỉ số tự nhiên 0–10) | Medium |
| VB-E07 | Cấp TID: số seri trùng | Seri đã cấu hình ở HĐ khác (≠ Hủy/Thanh lý) | Khai POS với seri trùng | Báo trùng / chặn | High |
| VB-E08 | Đổi phí < phí mốc | HĐ có phí mốc | Nhập phí < mốc đại lý theo MCC/Nhóm/NH | Ô phí tô đỏ / chặn xác nhận | High |
| VB-E09 | Đổi phí: không đổi loại nào | — | Mở PL đổi phí, không sửa phí nào → Xác nhận | Chặn (bắt buộc đổi ≥1 loại phí) | Medium |
| VB-E10 | Sửa/Hủy khi đã có đối tượng ký | Văn bản đã có người ký | Thử Sửa / Hủy | **Không** cho Sửa/Hủy (chỉ khi Nháp/chưa ai ký) | High |
| VB-E11 | Thêm mới STK: field validation | Mở popup Thêm tài khoản | Số TK > 50 ký tự / bỏ trống Ngân hàng | Số TK chặn quá 50 ký tự; Ngân hàng bắt buộc | Medium |
| VB-E12 | GUQ NNUQ: VH duyệt Từ chối | GUQ NNUQ chờ VH duyệt | VH chọn "Từ chối" | Trạng thái VH duyệt = Từ chối; xử lý theo quy định | Medium |

---

## 🔗 Để dành cho tầng Integration (file riêng)
- PL **cấp bổ sung TID** ký + hiệu lực → **sinh TID mới** ở Quản lý TID/MID.
- PL/GUQ **đổi TK** hiệu lực → cập nhật **TK nhận thanh toán** hiển thị ở Chi tiết TID.
- GUQ NNUQ liên kết hồ sơ NNUQ (module Thẩm định) & chức năng BD ký.

## ❓ Hỏi BA (trong phạm vi Văn bản)
1. **GUQ người đại diện MC**: spec tiêu đề ghi "…→ GtelPay ký" nhưng danh sách trạng thái chỉ có BD ký → MC đã ký (không có GtelPay) — xác nhận có bước GtelPay không?
2. **Thứ tự cấp bổ sung TID**: MC ký trước rồi QTRR thẩm định, hay QTRR trước?
3. MC là **Tổ chức** thì luồng đổi tài khoản thanh toán đi thế nào?
4. Lỗi chính tả trong spec: "tài khoảng", "yêu câu", "ngừoi", "Numeber", "nhắn với TID", "Gtealpay".
