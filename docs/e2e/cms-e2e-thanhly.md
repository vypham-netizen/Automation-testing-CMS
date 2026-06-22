# E2E — Module Thanh lý hợp đồng (CMS v1.5)

> **Phạm vi:** E2E nội bộ module Thanh lý hợp đồng (mục 1.1.5.x).
> **Đường dẫn:** Danh sách hợp đồng → chức năng **Thanh lý hợp đồng**.
> **Business rule:** chỉ áp dụng khi HĐ **Đang hoạt động** VÀ **tất cả TID đã Đóng**. Phương thức ký thanh lý theo phương thức ký của HĐ (ký tay ↔ ký tay; ký điện tử ↔ ký số).
> Tác giả: Vy (QC) · Cập nhật: 18/06/2026

**Vai trò:** MC = đại diện Merchant · GtelPay = Giám đốc ký số · VH = vận hành
**Trạng thái xử lý thanh lý:** TL - Chờ MC ký → TL - Chờ GtelPay ký → TL - Đã thanh lý · (ký tay: TL - Chờ xử lý)

---

## 🟢 MAIN FLOWS (trong module)

| ID | Luồng | Tiền đề | Các bước chính | Kết quả mong đợi | Priority |
|----|-------|---------|----------------|------------------|----------|
| TL-M01 | Thanh lý **ký số điện tử** (full) | HĐ Đang hoạt động (ký điện tử), đã đóng hết TID | Thanh lý hợp đồng → popup Xác nhận → Xác nhận → gen BB → MC ký (link) → GtelPay ký số | HĐ = Thanh lý; trạng thái xử lý: TL-Chờ MC ký → TL-Chờ GtelPay ký → **TL-Đã thanh lý**; gửi mail từng chặng; BB hiển thị ở Quản lý văn bản | High |
| TL-M02 | Thanh lý **ký tay** | HĐ Đang hoạt động (ký tay), đã đóng hết TID | Thanh lý → Xác nhận → gen BB → (popup view) → VH tiếp nhận → Tải lên BB đã ký | Sau gen: HĐ = Thanh lý, trạng thái xử lý = **TL-Chờ xử lý** + hiện nút Tải lên BB; BB ở QL văn bản "Chờ xử lý"; VH = Chờ tiếp nhận; sinh 1 bản ghi loại Thanh lý ở màn Yêu cầu VH xử lý | High |
| TL-M03 | Gửi lại email ký BB | BB chờ MC ký, mail lỗi / link hết hạn (>48h) | Danh sách HĐ (cột Trạng thái xử lý) hoặc Chi tiết HĐ → nút **Gửi lại email ký** → Xác nhận | Gửi lại email link ký BB mới đến đại diện MC; ẩn nút sau khi gửi thành công | Medium |
| TL-M04 | Popup view Biên bản thanh lý | Đã xác nhận thanh lý / có BB | Xác nhận thanh lý → popup view; hoặc QL văn bản → mở BB → Tải file | Xem nội dung BB; tải file tên **"Biên bản thanh lý_[số hợp đồng]"**; Đóng tắt popup | Medium |
| TL-M05 | Sau "TL - Đã thanh lý" | HĐ đã thanh lý xong | Mở lại HĐ + các văn bản đi kèm | HĐ **chỉ xem**, không thao tác chức năng; GUQ/Phụ lục đi kèm → **Hết hiệu lực** | High |
| TL-M06 | HĐ đã thanh lý vẫn đối soát được | HĐ TL-Đã thanh lý | Thực hiện đối soát cho HĐ đã thanh lý | Vẫn cho đối soát (theo note BA) | Low |

---

## 🟠 EDGE CASES (trong module)

| ID | Luồng | Tiền đề | Các bước chính | Kết quả mong đợi | Priority |
|----|-------|---------|----------------|------------------|----------|
| TL-E01 | Chức năng disable khi HĐ chưa Đang hoạt động | HĐ ≠ Đang hoạt động | Quan sát/nhấn chức năng Thanh lý | Chức năng **disable** | High |
| TL-E02 | Thanh lý khi còn TID chưa đóng | HĐ Đang hoạt động nhưng còn TID chưa Đóng | Quan sát/nhấn Thanh lý | **Disable / chặn** (chỉ enable khi đã đóng HẾT TID) | High |
| TL-E03 | Phương thức ký thanh lý khớp HĐ | HĐ ký tay / ký điện tử | Thực hiện thanh lý | HĐ ký tay → thanh lý **ký tay**; HĐ ký điện tử → **ký số điện tử** (đúng phương thức) | High |
| TL-E04 | Upload BB (ký tay) quá dung lượng | TL-Chờ xử lý, có nút Tải lên | Tải lên file > 15MB | Báo lỗi **"Vui lòng tải lên file < 15MB"** | Medium |
| TL-E05 | Upload BB sai định dạng | TL-Chờ xử lý | Tải lên file không phải .pdf | Báo lỗi **"Vui lòng tải file định dạng .pdf"** | Medium |
| TL-E06 | Gửi lại email ký: link còn hạn / MC đã ký | BB chưa quá 48h hoặc MC đã ký | Quan sát nút Gửi lại email ký | Nút **không hiển thị** (chỉ hiện khi mail lỗi / link hết hạn & MC chưa ký) | Medium |
| TL-E07 | Thứ tự ký: GtelPay ký khi MC chưa ký | BB ở TL-Chờ MC ký | Lãnh đạo thử ký khi MC chưa ký | Chưa chuyển sang TL-Chờ GtelPay ký; GtelPay chưa ký được (đúng thứ tự MC → GtelPay) | Medium |

---

## 🔗 Integration modules
- **Tiền đề** thanh lý: tất cả TID **Đóng** (output module Quản lý TID/MID) + HĐ Đang hoạt động.
- BB thanh lý ký điện tử → đi qua **Ký số** (GtelPay) ; ký tay → qua **Yêu cầu VH xử lý**.
- Sau thanh lý → GUQ/Phụ lục (module Văn bản) chuyển **Hết hiệu lực**.
- HĐ đã thanh lý vẫn vào **đối soát** (bản 2.0).

## ❓ Hỏi BA (Thanh lý)
1. Đối soát sau thanh lý: phạm vi/giới hạn cụ thể?
2. Ký tay: sau khi VH tải lên BB đã ký → trạng thái xử lý chuyển tiếp thế nào (lên TL-Đã thanh lý ngay hay qua duyệt)?
3. Thời hạn link ký BB = 48h (giống các văn bản khác) — xác nhận.
