# BUG-1 — UI không hiển thị lỗi khi action TID bị backend từ chối (400)

| | |
|---|---|
| **Module** | Quản lý TID/MID (CMS-16) |
| **Môi trường** | Staging — https://stg-cmspos.gtelpay.vn:8443 |
| **Tài khoản** | QC Test NIVC |
| **Ngày phát hiện** | 24/06/2026 |
| **Người tìm** | Vy (QC) |
| **Mức độ (đề xuất)** | Major / Cao |
| **Loại** | Functional / UX — Error handling |

---

## Summary
Khi thực hiện các thao tác trên TID/MID (sửa TID, hủy yêu cầu, tạo file kết quả tra cứu) mà **backend trả về lỗi 400**, giao diện **không hiển thị bất kỳ thông báo nào**: không toast, không thông báo lỗi inline, modal đứng im. Người dùng tưởng thao tác chưa chạy nên bấm lại nhiều lần, hoặc tưởng đã thành công và bỏ đi — trong khi thực tế thao tác đã thất bại. Backend ĐÃ trả message lỗi rõ ràng trong response body nhưng frontend không đọc/hiển thị.

## Precondition
- Đăng nhập CMS staging bằng tài khoản QC Test NIVC.
- Vào màn **Quản lý TID/MID** (`/tid-mid-management`).
- Có sẵn ≥2 bản ghi TID, trong đó tồn tại 1 TID đã dùng (vd `TIDTHUY001`) để tạo trường hợp trùng.

## Steps to reproduce (luồng chính: Sửa TID trùng)
1. Tại danh sách TID/MID, bấm icon **Sửa (bút chì)** ở 1 dòng bất kỳ → mở modal "Chỉnh sửa TID / MID".
2. Sửa ô **TID** thành một giá trị đã tồn tại trên hệ thống, ví dụ `TIDTHUY001`.
3. Nhập **Lý do sửa** (bất kỳ).
4. Bấm **Xác nhận**.
5. Quan sát giao diện sau khi bấm.

## Expected
- Hệ thống hiển thị thông báo lỗi rõ ràng cho người dùng, ví dụ toast/inline: **"TID đã tồn tại trên hệ thống, vui lòng nhập TID khác"** (dựa theo mã lỗi `contract.duplicate_acquirer_tid`).
- Modal giữ nguyên dữ liệu đã nhập để người dùng sửa lại; nút Xác nhận sẵn sàng cho lần thử tiếp.

## Actual
- Sau khi bấm Xác nhận: **modal đứng nguyên, không có thông báo nào** (không toast, không lỗi đỏ dưới ô TID), nút vẫn sáng.
- Request `PATCH /v1/terminals/{id}/tid-fields` trả **400** với body:
  ```json
  {"message":"contract.duplicate_acquirer_tid","error":"Bad Request","statusCode":400}
  ```
- Người dùng không hề biết thao tác đã thất bại.

## Phạm vi ảnh hưởng — tái hiện ở 3 luồng (cùng 1 nguyên nhân)
| Luồng | API | HTTP | Message backend trả về |
|-------|-----|------|------------------------|
| Sửa TID trùng | `PATCH /v1/terminals/{id}/tid-fields` | 400 | `contract.duplicate_acquirer_tid` |
| Hủy yêu cầu TID đang Tạm hoãn | `POST /v1/terminals/request-status` (action=cancel) | 400 | `contract.invalid_state` |
| Tạo file kết quả tra cứu | `POST /v1/terminals/lookup-tid/export` | 400 | `Không thể tạo file kết quả...` + chi tiết lỗi từng dòng |

→ Cả 3 đều có chung triệu chứng: backend trả lỗi (đôi khi rất chi tiết) nhưng UI im lặng hoàn toàn.

## Evidence
- `01-truoc-submit-form-hop-le.png` — form Sửa TID đã nhập TID trùng + lý do, trước khi bấm Xác nhận.
- `02-sau-submit-modal-dung-im-khong-loi.png` — **sau khi bấm Xác nhận: modal y nguyên, không thông báo lỗi** (dù API trả 400).
- `03-vidu-M06-huy-tu-tamhoan.png` — minh hoạ luồng Hủy từ Tạm hoãn (cùng lỗi).
- Response 400 body + headers đã ghi ở bảng trên (lấy từ Network tab; `content-type: application/json`).

## Đề xuất hướng xử lý
- Frontend bắt nhánh lỗi (status ≥ 400) của các API action TID và hiển thị message cho người dùng (map mã lỗi `contract.*` sang text tiếng Việt thân thiện; với export thì hiện bảng lỗi theo dòng như màn upload tra cứu đã làm tốt).
- Cân nhắc disable/khoá nút trong lúc chờ response để tránh double-submit.

## Câu hỏi liên quan (cho BA)
- Riêng luồng "Hủy TID đang Tạm hoãn" (mã `contract.invalid_state`): nghiệp vụ có cho phép Tạm hoãn → Hủy không? Nếu CÓ thì đây còn là lỗi backend (không nên trả invalid_state); nếu KHÔNG thì UI phải disable nút "Hủy yêu cầu" cho TID đang Tạm hoãn ngay từ đầu.
