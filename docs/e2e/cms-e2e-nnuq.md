# E2E — Module Hồ sơ NNUQ (Danh sách / CRUD / Thẩm định NNUQ) (CMS v1.5)

> **Phạm vi:** E2E nội bộ module Danh sách Người nhận ủy quyền (NNUQ) — gồm CRUD (CMS-21) + Thẩm định hồ sơ NNUQ (CMS-22).
> **Đường dẫn:** Hồ sơ NNUQ → Danh sách NNUQ (hoặc Chi tiết hợp đồng → Danh sách NNUQ → Thêm NNUQ).
> **Quyền:** Xem · Sửa · Nhập kết quả thẩm định NNUQ · Xem & tải file.
> Tác giả: Vy (QC) · Cập nhật: 18/06/2026

**Business rules:** hiển thị NNUQ của **tất cả Merchant**; mỗi **CC/CCCD chỉ 1 bản ghi** (check trùng theo CCCD); sắp xếp **giảm dần theo ngày tạo**.
**Trạng thái thẩm định:** Chờ thẩm định · Đạt · Không đạt · Yêu cầu chỉnh sửa.

---

## 🟢 MAIN FLOWS (trong module)

| ID | Luồng | Tiền đề | Các bước chính | Kết quả mong đợi | Priority |
|----|-------|---------|----------------|------------------|----------|
| NU-M01 | Xem danh sách NNUQ | Có quyền Xem | Mở Hồ sơ NNUQ → Danh sách NNUQ | Grid đủ cột: STT, Thời gian tạo, Thông tin NNUQ (Họ tên/CCCD/email xác nhận/SĐT), Trạng thái thẩm định (+ lý do nếu Không đạt/YC chỉnh sửa), Thao tác; sắp xếp mới nhất lên đầu | High |
| NU-M02 | Tìm kiếm Tên NNUQ / CC-CCCD | Có dữ liệu | Nhập (tương đối) tên / CCCD | Lọc bản ghi khớp tương đối (≤255 ký tự) | Medium |
| NU-M03 | Lọc theo Trạng thái thẩm định | Có dữ liệu | Mở droplist Trạng thái → chọn | Droplist Đạt / Không đạt / Chờ thẩm định; lọc đúng | High |
| NU-M04 | **Thêm mới NNUQ thành công** | Có quyền | Thêm mới → upload CCCD trước/sau + Biên bản → điền đủ trường → Tạo mới | Tạo bản ghi trạng thái **Chờ thẩm định**; quay lại + thông báo "Thêm NNUQ thành công." | High |
| NU-M05 | Xem chi tiết NNUQ | Có bản ghi | Icon Xem chi tiết | Hiển thị đầy đủ: họ tên, giới tính, CCCD, quốc tịch, ngày sinh/cấp/hết hạn, SĐT, email, địa chỉ TT/hiện tại, TK ngân hàng, Hồ sơ (CCCD trước/sau, Biên bản — xem/tải) | High |
| NU-M06 | **Thẩm định NNUQ → Đạt** | NNUQ Chờ thẩm định, có quyền Nhập KQ | Chi tiết → Nhập kết quả → Đạt → Xác nhận | Trạng thái thẩm định → **Đạt** | High |
| NU-M07 | **Thẩm định NNUQ → Không đạt** | NNUQ Chờ thẩm định | Nhập kết quả → Không đạt → nhập Lý do → Xác nhận | Trạng thái → **Không đạt**; hiển thị lý do dưới trạng thái | High |
| NU-M08 | **Thẩm định → Yêu cầu chỉnh sửa** | NNUQ Chờ thẩm định | Nhập kết quả → Yêu cầu chỉnh sửa → nhập Lý do → Xác nhận | Trạng thái → **Yêu cầu chỉnh sửa** (mở khóa nút Sửa) | High |
| NU-M09 | Sửa NNUQ | NNUQ trạng thái Yêu cầu chỉnh sửa | Icon Sửa → refill → đổi thông tin → Cập nhật → popup xác nhận | Cập nhật thông tin; trạng thái về **Chờ thẩm định**; CC/CCCD + Họ tên disable | High |
| NU-M10 | Xóa NNUQ | NNUQ Chờ thẩm định, chưa gắn ủy quyền TID nào | Icon Xóa → popup xác nhận → Xác nhận | Xóa NNUQ khỏi hệ thống; đóng popup; loại khỏi danh sách | High |
| NU-M11 | Thẩm định khi NNUQ đang có ủy quyền | NNUQ đang ủy quyền tại HĐ | Nhập kết quả thẩm định (bất kỳ) → Xác nhận | Các ủy quyền của NNUQ đó tại HĐ → đổi về **Chờ BD ký** | High |
| NU-M12 | Xem / tải file hồ sơ | NNUQ có hồ sơ | Mở/tải CCCD trước/sau, Biên bản xác minh | Xem & tải được file | Low |

---

## 🟠 EDGE CASES & FIELD VALIDATION (trong module)

| ID | Luồng | Tiền đề | Các bước chính | Kết quả mong đợi | Priority |
|----|-------|---------|----------------|------------------|----------|
| NU-E01 | CC/CCCD trùng | CCCD đã tồn tại trên hệ thống | Tạo NNUQ với CCCD trùng | Không cho tạo (mỗi CCCD chỉ 1 bản ghi) | High |
| NU-E02 | CC/CCCD sai định dạng | Màn Thêm | Nhập chữ / ≠ 12 số | Chỉ nhận số; báo "Số CC/CCCD phải có 12 ký tự" | High |
| NU-E03 | Email trùng | Email đã tồn tại | Nhập email trùng NNUQ khác | Chặn (email check trùng toàn hệ thống) | High |
| NU-E04 | Tuổi ngoài 18–80 | Màn Thêm | Nhập ngày sinh cho tuổi <18 hoặc >80 | Báo "Tuổi NNUQ phải nằm trong độ tuổi từ 18-80" | High |
| NU-E05 | CCCD đã hết hạn | Màn Thêm | Ngày hết hạn < ngày hiện tại | Báo "CCCD đã hết hạn. Vui lòng kiểm tra lại ngày hết hạn." | High |
| NU-E06 | Họ tên độ dài | Màn Thêm | Nhập <4 ký tự / >255 ký tự | <4: "Họ tên phải có ít nhất 4 ký tự"; >255: "Họ tên không được vượt quá 255 ký tự" | Medium |
| NU-E07 | Bỏ trống trường bắt buộc | Màn Thêm | Để trống họ tên/CCCD/giới tính/ngày sinh/nơi cấp/ngày cấp/ngày hết hạn/địa chỉ/quốc tịch → Tạo mới | Báo lỗi "Vui lòng nhập/chọn …" tương ứng từng trường | High |
| NU-E08 | Upload file lỗi | Màn Thêm | File >5MB / sai định dạng / chưa tải | ">5MB: "Dung lượng file vượt quá giới hạn cho phép (5MB)"; chưa tải: "File chưa được tải lên"; chỉ pdf/jpg/png | High |
| NU-E09 | SĐT sai định dạng | Màn Thêm | Nhập chữ / >10 ký tự | Chỉ nhận số (cho số 0 đầu), giới hạn 10 ký tự | Medium |
| NU-E10 | Email sai định dạng | Màn Thêm | Nhập email sai chuẩn | Chặn (email đúng định dạng chuẩn) | Medium |
| NU-E11 | Nút Sửa theo trạng thái | NNUQ Đạt / Không đạt / Chờ thẩm định | Quan sát nút Sửa | Sửa **disable**; chỉ enable khi trạng thái **Yêu cầu chỉnh sửa** | High |
| NU-E12 | Nút Xóa theo trạng thái/ràng buộc | NNUQ đã thẩm định hoặc đã gắn ủy quyền | Quan sát nút Xóa | Xóa **disable**; chỉ enable khi Chờ thẩm định + chưa gắn ủy quyền TID nào | High |
| NU-E13 | Sửa: khóa CCCD + Họ tên | Màn Sửa | Quan sát 2 trường | CC/CCCD và Họ tên **disable** không cho sửa | Medium |
| NU-E14 | Thẩm định bỏ trống Lý do | Kết quả = Không đạt / Yêu cầu chỉnh sửa | Bỏ trống Lý do → Xác nhận | Chặn (Lý do bắt buộc) | High |
| NU-E15 | Lý do ẩn/hiện theo kết quả | Popup thẩm định | Chọn Đạt rồi đổi sang Không đạt/YC chỉnh sửa | Đạt → ẩn Lý do; Không đạt / YC chỉnh sửa → hiện Lý do | Medium |
| NU-E16 | Phân quyền | TK thiếu quyền Sửa / Nhập KQ thẩm định / Xem & tải | Thao tác tương ứng | Ẩn/chặn chức năng theo quyền | Medium |

---

## 🔗 Integration modules
- NNUQ trạng thái **Đạt** mới được chọn ở **GUQ** (module Văn bản — tạo giấy ủy quyền cho NNUQ).
- Email xác nhận NNUQ dùng để **gửi OTP ký điện tử** GUQ (module Link ký điện tử).
- Thẩm định NNUQ khi đang có ủy quyền → ủy quyền đổi về **Chờ BD ký** (chuỗi ký BD → NNUQ → MC).

## ❓ Hỏi BA (Hồ sơ NNUQ)
1. Bộ lọc Trạng thái thẩm định chỉ liệt kê 3 giá trị (Đạt / Không đạt / Chờ thẩm định) nhưng hệ thống có thêm **"Yêu cầu chỉnh sửa"** — filter có bao gồm trạng thái này không?
2. Lỗi #15 "Số TID ủy quyền" + #16 "thông tin từng dòng POS" → màn **Thêm NNUQ từ Chi tiết hợp đồng** có bảng gắn TID/POS? Spec control không mô tả bảng này — cần wireframe.
3. Trường **"Tài khoản Ngân hàng"** ở màn chi tiết bị bỏ trống control — hiển thị nội dung gì?
4. Ngày sinh / quốc tịch "phải trùng CC/CCCD" — hệ thống tự OCR đối chiếu hay người nhập tự đảm bảo (không validate tự động)?
5. Spec ghi "Ngày cấp/hết hạn phải trùng … trên ĐKKD đã tải lên" — NNUQ dùng **CCCD** chứ không phải ĐKKD → nghi copy nhầm, xác nhận đối chiếu theo CCCD.
