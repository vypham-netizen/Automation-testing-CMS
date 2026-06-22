# CMS POS v1.5 — E2E Test Scenarios

> Kịch bản kiểm thử **end-to-end** (luồng nghiệp vụ xuyên màn), chia 2 nhánh: **Main flows** (happy path) và **Edge cases**.
> Nguồn: PRD CMS v1.5 + đặc tả Quản lý TID/MID, Quản lý văn bản, Thẩm định, Ký số, Thanh lý.
> Tác giả: Vy (QC) · Cập nhật: 18/06/2026

**Vai trò:** MC = đại diện Merchant · BD = kinh doanh · QTRR = thẩm định rủi ro · GtelPay = Giám đốc ký số · VH = vận hành
**Module:** M1 Quản lý TID/MID · M2 Quản lý văn bản · M3 Thẩm định · M4 Ký số/Link ký · M5 Thanh lý

---

## 🟢 NHÁNH A — MAIN FLOWS (Happy / Golden path)

| ID | Luồng | Module | Tiền đề | Các bước chính | Kết quả mong đợi | Priority |
|----|-------|--------|---------|----------------|------------------|----------|
| E2E-M01 | Onboarding & kích hoạt HĐ | M1–M4 | Có MC trong hệ thống | Tạo merchant → gửi thẩm định → QTRR thẩm định hồ sơ **Đạt** → Tạo HĐ (ký điện tử) → MC ký OTP → GtelPay ký số | HĐ "Đang hoạt động", có ngày ký; POS sinh ở Quản lý TID/MID (Chưa hoạt động / Tiếp nhận) | High |
| E2E-M02 | Cấp TID (vòng đời thuận) | M1 | HĐ Đang hoạt động, POS Chưa hoạt động | Tick POS → Gửi bank → Import file kết quả (Bank chấp nhận) → Bàn giao BD | TID được cấp, Trạng thái "Đang hoạt động"; mail bàn giao gửi đại lý kèm TID | High |
| E2E-M03 | Đóng TID | M1 | TID Đang hoạt động | Gửi bank đóng TID (import) → Import file phản hồi bank | Tiến trình Gửi bank đóng → Bank phản hồi đóng; Trạng thái = "Đóng" | High |
| E2E-M04 | Đổi tài khoản TT — chủ TK Merchant | M2,M4 | HĐ Đang hoạt động | Tạo phụ lục đổi TK → MC ký → GtelPay ký → VH duyệt ngày hiệu lực | Phụ lục Còn hiệu lực; TK mới gắn TID, TK cũ Hết hiệu lực | High |
| E2E-M05 | Đổi tài khoản TT — chủ TK NNUQ | M2,M3,M4 | HĐ Đang hoạt động, có NNUQ | Tạo GUQ (chọn NNUQ) → QTRR thẩm định hồ sơ NNUQ Đạt → BD ký → NNUQ ký OTP → MC ký | GUQ hiệu lực; TK NNUQ gắn TID; VH duyệt: Chờ tiếp nhận → Đã tiếp nhận | High |
| E2E-M06 | Cấp bổ sung TID (Phụ lục 03) 🔗 | M2,M3,M1 | HĐ Đang hoạt động | Tạo phụ lục cấp TID (khai POS) → MC ký → QTRR thẩm định Đạt → GtelPay ký | Phụ lục hiệu lực → **TID mới xuất hiện ở Quản lý TID/MID** (vào vòng đời M02) | High |
| E2E-M07 | Đổi phí | M2,M4 | HĐ Đang hoạt động | Tạo phụ lục đổi phí (phí ≥ mốc) → MC ký → GtelPay ký | Phí mới áp dụng cho HĐ | Medium |
| E2E-M08 | Thanh lý HĐ (ký điện tử) | M5,M4 | HĐ Đang hoạt động **& đã đóng hết TID** | Thanh lý → gen biên bản → MC ký → GtelPay ký | HĐ "Đã thanh lý"; cho tải BBTL | High |
| E2E-M09 | Thanh lý HĐ (ký tay) | M5 | HĐ Đang hoạt động & đã đóng hết TID | Thanh lý ký tay → gen biên bản → tạo yêu cầu VH xử lý → upload BBTL đã ký | HĐ "Đã thanh lý" | High |
| **E2E-M10** | **Golden path đầu-cuối** | M1–M5 | — | M01 → M02 → (M04/M06/M07 phát sinh) → M03 đóng hết TID → M08 thanh lý | Toàn vòng đời HĐ chạy thông suốt | High |

---

## 🟠 NHÁNH B — EDGE CASES (E2E)

| ID | Luồng | Module | Tiền đề | Các bước chính | Kết quả mong đợi | Priority |
|----|-------|--------|---------|----------------|------------------|----------|
| E2E-E01 | Thẩm định Không đạt → nộp lại | M3 | Hồ sơ chờ thẩm định | Thẩm định "Yêu cầu nộp lại" → KD đẩy file mới → QTRR thẩm định lại Đạt | Vòng nộp-lại chạy đúng (liên quan bug CMS-209/210) | High |
| E2E-E02 | Chặn tạo HĐ khi hồ sơ chưa Đạt | M3 | MC hồ sơ chưa/không đạt | Thử Tạo hợp đồng | Hệ thống chặn, không cho tạo HĐ | High |
| E2E-E03 | Tạo văn bản khi HĐ chưa Đang hoạt động | M2 | HĐ ≠ Đang hoạt động | Tạo phụ lục/GUQ | Trạng thái ký = **Nháp**, **không** gửi mail ký | High |
| E2E-E04 | Import file kết quả TID có dòng lỗi | M1 | Có file import lỗi | Import file có ≥1 dòng sai (seri trùng / TID tồn tại / thiếu cột / seri không có) | **Toàn bộ file bị chặn**; bảng lỗi theo dòng; tải được file hợp lệ/không hợp lệ | High |
| E2E-E05 | Link ký điện tử hết hạn 48h | M4 | Đã gửi link ký | MC mở link sau 48h → từ chối → Gửi lại email ký → ký lại | Link cũ vô hiệu; link mới gửi lại OK | High |
| E2E-E06 | OTP sai khi ký điện tử | M4 | Đang ký điện tử | Nhập OTP sai nhiều lần | Bị từ chối; cho gửi lại mã (mã hết hạn 2 phút) | Medium |
| E2E-E07 | Thanh lý khi còn TID chưa đóng | M5 | HĐ còn TID Đang hoạt động | Thử thanh lý | Bị **chặn** kèm cảnh báo "còn TID chưa đóng" | High |
| E2E-E08 | Cấp bổ sung TID: QTRR Không đạt | M2,M3 | Phụ lục 03 chờ thẩm định | MC ký → QTRR "Không đạt" | Phụ lục trả lại kèm lý do; không sinh TID | Medium |
| E2E-E09 | Đổi TK: POS đang có yêu cầu chờ duyệt | M2 | POS có yêu cầu đổi TK chờ duyệt | Tạo phụ lục đổi TK, chọn Seri-TID đó | POS bị **disable** không cho chọn (chống tạo trùng) | Medium |
| E2E-E10 | Phí mới < phí mốc | M2 | HĐ Đang hoạt động | Đổi phí nhập phí thấp hơn mốc đại lý | Ô phí tô đỏ / chặn xác nhận | Medium |
| E2E-E11 | MC là Tổ chức (luồng đổi TK) | M2 | MC loại Tổ chức | Mở tạo văn bản đổi TK | Disable NNUQ & người đại diện MC (chỉ Merchant) — *cần BA xác nhận* | Medium |
| E2E-E12 | Số seri POS trùng | M1,M2 | Seri đã cấu hình ở HĐ khác | Khai POS với seri trùng (HĐ ≠ Hủy/Thanh lý) | Bị chặn / báo trùng | Medium |
| E2E-E13 | Hủy / Sửa văn bản theo trạng thái | M2 | Văn bản Nháp & đã ký | Sửa/Hủy văn bản ở Nháp (OK) vs đã có đối tượng ký (chặn) | Chỉ cho Sửa/Hủy khi Nháp/chưa ai ký; đã ký → chặn | Medium |
| E2E-E14 | MC từ chối ký hợp đồng | M4 | HĐ chờ MC ký (điện tử) | MC mở link → Từ chối ký | HĐ ghi nhận từ chối, không kích hoạt | Medium |
| E2E-E15 | Tạm hoãn → Hủy TID | M1 | TID Đang hoạt động | Tạm hoãn (nhập lý do, gửi mail) → Hủy yêu cầu | Trạng thái Tạm hoãn → Hủy; mail gửi đại lý đúng nội dung | Medium |

---

## ❓ Điểm cần hỏi BA (gắn với các E2E)
1. **E2E-M05/M04:** GUQ người đại diện MC có bước GtelPay ký không (spec mâu thuẫn: tiêu đề có, danh sách trạng thái không)?
2. **E2E-M06:** thứ tự ở cấp bổ sung TID — MC ký trước rồi QTRR thẩm định, hay QTRR trước?
3. **E2E-E11:** MC là Tổ chức thì luồng đổi tài khoản thanh toán đi thế nào (vì disable cả NNUQ lẫn người đại diện)?
4. **TID/MID:** bộ lọc ngày trên UI là "ngày tạo POS" nhưng spec ghi "ngày cấp TID" — xác nhận đúng field.
5. **Bank gửi file kết quả TID qua kênh nào** (email/SFTP/portal) và có đúng template import không?

## 📌 Ghi chú
- Mỗi E2E nên chạy trên môi trường **Staging** với dữ liệu test (cờ "Thử nghiệm").
- Các luồng gửi mail/ký số thật → cần tài khoản email nhận OTP & cấu hình ký số (VNPT Smart CA).
- Có thể tự động hoá nhánh Main bằng Playwright (script seed merchant+HĐ đã có trong repo này).
