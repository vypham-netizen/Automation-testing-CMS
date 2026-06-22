# E2E — Module Link ký điện tử (HĐ / GUQ / Phụ lục / Biên bản thanh lý) (CMS v1.5)

> **Phạm vi:** E2E nội bộ module Link ký điện tử qua OTP cho **Hợp đồng, Giấy ủy quyền (GUQ), Phụ lục (đổi TK / đổi phí / cấp bổ sung TID), Biên bản thanh lý**.
> **Đặc điểm:** mỗi link phục vụ **1 đối tượng ký 1 loại hồ sơ cụ thể**, hiệu lực **48h** (quá hạn BD gen lại + gửi mail).
> **Đối tượng ký:** HĐ/Phụ lục/BB thanh lý → Người đại diện MC · GUQ → NNUQ + Người đại diện MC.
> Tác giả: Vy (QC) · Cập nhật: 18/06/2026

**Luồng chung mỗi link:** Truy cập link → màn Thông tin (email **mã hóa** `[2 đầu]***[1 cuối]@domain`) → bấm "Ký…" → **OTP xác thực truy cập** (6 ô) → màn **Ký điện tử** (email **đầy đủ** + Preview + checkbox điều khoản) → bấm Ký điện tử → **OTP ký điện tử** → ký thành công.
**Quy tắc OTP (dùng chung):** countdown resend 2 phút · gửi lại tối đa 5 lần/ngày · nhập sai 5 lần liên tiếp → khóa luồng ký trong ngày · reset 0h hôm sau · OTP đúng = đúng email + còn hạn (2 phút) + nhập đúng.

---

## 🟢 MAIN FLOWS (trong module)

| ID | Luồng | Tiền đề | Các bước chính | Kết quả mong đợi | Priority |
|----|-------|---------|----------------|------------------|----------|
| KD-M01 | Truy cập link còn hiệu lực → màn Thông tin | Link chưa ký, còn hạn 48h | Mở link | Hiển thị: Tổ chức/HKD (tên MC), Số HĐ, (Số GUQ/PL), Người đại diện/NNUQ, **Email mã hóa**, Ngân hàng; có nút "Ký…" | High |
| KD-M02 | OTP xác thực truy cập → vào màn Ký | Đang ở màn Thông tin | Bấm "Ký…" → nhận OTP 6 số qua email → nhập đúng → Xác nhận | Gửi OTP tới đúng email; nhập đúng → chuyển **màn Ký điện tử** (email hiển thị đầy đủ + Ngành nghề-MCC + Preview) | High |
| KD-M03 | **Ký điện tử Hợp đồng thành công** | Màn ký HĐ (MC) | Đọc hết HĐ (scroll cuối) → tick điều khoản → Ký điện tử → nhập OTP ký đúng | Ký thành công (popup); HĐ → trạng thái xử lý **Chờ thẩm định**; ghi lịch sử xử lý HĐ | High |
| KD-M04 | **Từ chối ký Hợp đồng** | Màn ký HĐ, chưa ký | Bấm Từ chối ký → nhập Lý do (≤255) → Xác nhận | HĐ → **HĐ - MC từ chối ký**; lưu lý do; **link hết hiệu lực**; ghi lịch sử | High |
| KD-M05 | **GUQ — NNUQ ký điện tử thành công** | Link GUQ đối tượng NNUQ | NNUQ truy cập link → OTP xác thực → tick + ký → OTP ký | Trạng thái ký NNUQ (QL văn bản) → **Chờ MC ký**; hệ thống **gen link + gửi mail** ký GUQ cho người đại diện MC | High |
| KD-M06 | **GUQ — MC ký thành công (chốt hiệu lực)** | Link GUQ đối tượng MC, NNUQ đã ký | MC truy cập link → ký điện tử thành công | Trạng thái → **MC đã ký**, hiệu lực **Đang hiệu lực**; **ngày hiệu lực theo mốc 12h/00h**; gửi mail MC; **TK/PL cũ → hết hiệu lực**; sinh 1 bản ghi đổi TK NNUQ ở **màn VH xử lý** (Đã tiếp nhận) | High |
| KD-M07 | **Phụ lục đổi phí — MC ký** | Link PL đổi phí | MC ký điện tử thành công | PL → **Chờ GtelPay ký**; gửi mail lãnh đạo; hiển thị ở DS phụ lục chờ GtelPay ký | High |
| KD-M08 | **Phụ lục cấp bổ sung TID — MC ký** | Link PL bổ sung TID | MC ký điện tử thành công | PL → **Chờ thẩm định**; hiển thị ở màn **Thẩm định phụ lục** (QTRR) | High |
| KD-M09 | **Phụ lục đổi TK thanh toán — MC ký** | Link PL đổi TK | MC ký điện tử thành công | PL → **Chờ GtelPay ký**; gửi mail lãnh đạo; hiển thị ở DS chờ GtelPay ký | High |
| KD-M10 | **Biên bản thanh lý — MC ký** | Link BB thanh lý (HĐ ký điện tử) | MC ký điện tử thành công (**màn này KHÔNG có nút Từ chối**) | HĐ → trạng thái xử lý **TL_Chờ GtelPay ký**; gửi mail lãnh đạo; BB hiển thị ở DS BB thanh lý chờ GtelPay ký | High |
| KD-M11 | Gửi lại OTP sau countdown | Hết countdown 2 phút | Bấm "Gửi lại" | Sinh OTP mới + gửi mail; noti "Mã OTP… đã được gửi tới email…"; **OTP cũ mất hiệu lực** | Medium |
| KD-M12 | Bảng thông tin tài khoản thanh toán (GUQ/PL) | Màn ký GUQ / phụ lục | Quan sát bảng TK thanh toán | Hiển thị máy POS, STK nhận thanh toán, email; **TID/MID để trống** (chưa phát triển) | Medium |
| KD-M13 | Mã hóa email theo màn | Có link hợp lệ | So sánh màn Thông tin vs màn Ký | Màn Thông tin: email **mã hóa**; màn Ký điện tử: email **đầy đủ** | Low |

---

## 🟠 EDGE CASES (trong module)

| ID | Luồng | Tiền đề | Các bước chính | Kết quả mong đợi | Priority |
|----|-------|---------|----------------|------------------|----------|
| KD-E01 | Link đã ký | Văn bản đã ký xong | Mở lại link | Hiển thị màn "đã được ký" (không cho ký lại) | High |
| KD-E02 | Link hết hiệu lực >48h | Quá 48h từ lúc cấp link | Mở link | Hiển thị màn link hết hiệu lực (BD gen lại + gửi mail mới) | High |
| KD-E03 | Nhập sai OTP | Màn nhập OTP | Nhập OTP sai → Xác nhận | Báo **"Mã OTP không đúng. Vui lòng nhập lại."** | High |
| KD-E04 | Sai OTP 5 lần liên tiếp | Màn nhập OTP | Nhập sai 5 lần | **Khóa luồng ký trong ngày**; báo "Bạn đã nhập sai mã OTP 5 lần. Vui lòng thử lại vào ngày hôm sau."; mở khóa 0h hôm sau | High |
| KD-E05 | OTP hết hạn (>2 phút) | OTP đã gửi >2 phút | Nhập OTP cũ | Báo **"Mã OTP đã hết hạn. Vui lòng nhập mã khác."** | High |
| KD-E06 | Gửi lại OTP lần thứ 6 | Đã gửi lại 5 lần trong ngày | Bấm Gửi lại lần 6 | Không gửi; báo "Vượt quá số lần gửi lại mã OTP trong ngày…" / "Bạn đã sử dụng hết 5 lần giới hạn gửi OTP qua email." | High |
| KD-E07 | Hệ thống gửi OTP lỗi | Lỗi gửi mail | Bấm Ký / Gửi lại | Báo **"Gửi mã OTP bị lỗi. Vui lòng gửi lại."** | Medium |
| KD-E08 | Nút Xác nhận disable | Màn nhập OTP | Nhập < 6 số | Nút Xác nhận disable; đủ 6 số → enable | Medium |
| KD-E09 | Không cho resend trong 2 phút | Vừa gửi OTP | Quan sát trong 2 phút | Textlink "Gửi lại" ẩn, hiển thị countdown; hết 2 phút mới hiện link | Medium |
| KD-E10 | Nút Ký điện tử disable | Màn ký, chưa đủ điều kiện | Chưa tick checkbox / chưa scroll hết file | Nút Ký điện tử disable; tick + scroll cuối → active | High |
| KD-E11 | OTP đúng nhưng sai email người ký | OTP gửi cho email khác | Nhập OTP của email khác | Không chấp nhận (OTP chỉ hợp lệ với đúng email người ký) | High |
| KD-E12 | View OTP chỉ nhận số | Màn nhập OTP | Nhập chữ/ký tự đặc biệt | Chỉ nhận 0-9; auto focus ô kế tiếp | Low |
| KD-E13 | Từ chối ký — validate Lý do | Popup từ chối (HĐ) | Bỏ trống lý do / nhập >255 ký tự / bấm Đóng | Xác nhận disable khi trống; chặn >255; Đóng = không lưu | Medium |
| KD-E14 | Ẩn nút Từ chối theo trạng thái | Văn bản đã ký/đang ký/đã từ chối | Quan sát nút Từ chối | Nút Từ chối ẩn; **BB thanh lý không có nút Từ chối** | Medium |
| KD-E15 | Ký lỗi → cho ký lại | Lỗi khi ký | Ký điện tử gặp lỗi | Báo lỗi + cho ký lại; ghi action ký lỗi vào lịch sử (HĐ → MC ký lỗi / NNUQ ký lỗi) | High |
| KD-E16 | Reset 0h hôm sau | Đã bị khóa / hết lượt gửi | Sang 0h ngày mới | Reset số lần gửi OTP + mở khóa luồng ký | Medium |

---

## 🔗 Integration modules
- **Nguồn gen link:** BD tạo HĐ → link ký HĐ · BD ký số GUQ NNUQ → link NNUQ · NNUQ ký xong → link MC · BD tạo yêu cầu (đổi TK / bổ sung TID / đổi phí / thanh lý) → link phụ lục/BB tương ứng.
- **Sau ký:** HĐ → **Chờ thẩm định** · PL bổ sung TID → **Thẩm định phụ lục** (QTRR) · PL đổi phí/đổi TK + BB thanh lý → **Ký số GtelPay** (Chờ GtelPay ký) · GUQ MC ký → bản ghi **VH xử lý** + TK cũ hết hiệu lực.
- Ngày hiệu lực GUQ (MC ký) theo mốc **12h/00h** (module Văn bản / TID-MID).

## ❓ Hỏi BA (Link ký điện tử)
1. **Độ dài OTP ký điện tử:** spec ghi "6 số" nhưng mail mẫu hiển thị **"A122232"** (có chữ A, 7 ký tự) — OTP ký là 6 số hay có tiền tố chữ?
2. **2 bộ đếm độc lập?** "sai OTP 5 lần → khóa luồng ký" và "gửi lại OTP 5 lần/ngày" là 2 giới hạn riêng biệt đúng không?
3. **Mốc hiệu lực 12h/00h** chỉ áp cho **GUQ (MC ký)** hay áp cho cả phụ lục đổi TK?
4. **Phụ lục đổi TK (KD-M09):** spec ghi lẫn "Ký biên bản thanh lý thành công" + "Chờ GtelPay ký" → xác nhận trạng thái cuối là **Chờ GtelPay ký** (lỗi copy spec).
5. Label **"Số giấy ủy quyền"** xuất hiện cả ở màn ký **phụ lục** — phụ lục nên hiển thị "Số phụ lục" đúng không? (nghi copy nhầm).
6. Reset "0h ngày hôm sau" theo múi giờ server (GMT+7)?
