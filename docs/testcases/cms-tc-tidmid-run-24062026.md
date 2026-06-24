# Kết quả chạy E2E TID/MID — 24/06/2026

> Môi trường: staging https://stg-cmspos.gtelpay.vn:8443 · TK: QC Test NIVC · Driver: Playwright MCP
> Tham chiếu case: `docs/e2e/cms-e2e-tidmid.md`

| ID | Tên | Kết quả | Ghi chú |
|----|-----|---------|---------|
| TM-E03 | Chức năng disable khi chưa tick | ✅ | Gửi bank/Bàn giao/Tạm hoãn/Hủy disabled; Tra cứu enabled. ⚠️ KHÔNG có "Import file" trong menu (spec ghi có) → hỏi BA/quyền |
| TM-M10 | Danh sách: lọc + xuất excel | ⚠️ PASS có bug | Lọc Trạng thái=Hủy → đúng 2 dòng; export tôn trọng filter. BUG1: header cột phí chứa UUID thô (chưa map tên đơn vị phát hành thẻ). BUG2: 1 record masterdata rác (đoạn văn dài) lọt vào header export. Minor: tên file dùng "_" thay format spec |
| TM-E09 | Tìm kiếm không có kết quả | ✅ | Grid trống + "Không có bản ghi nào". Param q wire đúng vào ô search |
| TM-M09 | Xem chi tiết TID | ⚠️ Khác spec | Icon "Xem" mở Chi tiết HĐ (337/2026/POS/...), KHÔNG có màn chi tiết TID riêng. Trang HĐ có tab Danh sách TID/MID + Lịch sử xử lý. Cần BA xác nhận chỗ hiển thị lịch sử thay đổi TID (cũ→mới). Liên quan câu hỏi BA #4 |
| TM-E07 | Tạm hoãn/Hủy thiếu lý do | ✅ | Để trống lý do → chặn, lỗi "Bắt buộc", modal giữ nguyên. (Hiện 2 lần "Bắt buộc" - note nhỏ) |
| TM-M04 | Tạm hoãn TID | ✅ | TID dòng 6 chuyển Đang hoạt động→Tạm hoãn (POST request-status 201). Mail/log không verify qua list |
| TM-M06 | Tạm hoãn → Hủy | ❌ BUG | Hủy TID đang Tạm hoãn → BE trả 400 `contract.invalid_state`; UI KHÔNG hiện thông báo lỗi (modal đứng im, không toast). Menu "Hủy yêu cầu" vẫn enable cho TID Tạm hoãn. Mâu thuẫn giả định vòng đời "Tạm hoãn→Hủy 1 chiều" → cần BA chốt: nếu cho phép = bug BE; nếu không = bug UI (phải chặn sớm + báo lỗi rõ) |
| TM-M05 | Hủy yêu cầu cấp TID | ✅ (23/06) | đã có bản ghi Hủy |
| TM-M07 | Chỉnh sửa TID | ✅ | Sửa TID 11111→QCTEST24062026 + lý do → thành công (PATCH tid-fields 200), list cập nhật, modal đóng. TK QC Test NIVC mở/sửa được |
| TM-E05 | Sửa TID trùng | ✅ (+bug UX) | Sửa TID→TIDTHUY001 (đã tồn tại) → 400 `contract.duplicate_acquirer_tid`, chặn đúng. NHƯNG không hiện thông báo lỗi (cùng bug nuốt lỗi 400 với TM-M06) |
| TM-E04 | Sửa TID đã PSGD | 🚫 Blocked | Không có TID nào tiến trình "Có PSGD" trong data → không tạo được tiền đề. Cần fixture TID đã PSGD |
| TM-E06 | Phân quyền sửa | 🚫 Blocked | TK QC Test NIVC sửa được → hoặc là Trưởng phòng VH hoặc chưa enforce quyền. Cần TK KHÁC (không phải TP VH) để kết luận |
| TM-M08 | Tra cứu / mapping TID | ⏳ | đang kiểm tra nút Tra cứu (template?) |
| TM-E08 | Tra cứu thiếu TID&MID | ⏳ | phụ thuộc file Tra cứu |
| TM-M01 | Vòng đời TID Golden | 🚫 Blocked | TK QC Test NIVC KHÔNG có menu "Import file" (xem TM-E03) → không khởi tạo được luồng Gửi bank→Import. Cần TK có quyền import + file template bank |
| TM-M02 | Bank từ chối → gửi lại | 🚫 Blocked | như M01 (cần import) |
| TM-E01 | Import file có dòng lỗi | 🚫 Blocked | như M01 (cần import + file lỗi mẫu) |
| TM-E02 | Import đóng TID trạng thái sai | 🚫 Blocked | như M01 (cần import) |

## Chi tiết
