# CMS Automation (Playwright + TypeScript)

Framework test tự động cho hệ thống **CMS POS**.

## Cấu trúc (Page Object Model)
```
cms-automation/
├── tests/                  # File test (.spec.ts) — chỉ "kể chuyện", gọi Page Object
│   ├── auth.setup.ts       # Đăng nhập 1 lần, lưu session
│   ├── login.spec.ts       # Smoke: vào được màn chính
│   ├── tid-mid.spec.ts     # Test màn Quản lý TID/MID
│   └── seed.spec.ts        # Seed dữ liệu: tạo MC → thẩm định → ký HĐ
├── pages/                  # Page Object Model (mỗi màn 1 class)
│   ├── BasePage.ts         # Lớp cha: helper dùng chung (dropdown, datepicker)
│   ├── LoginPage.ts
│   ├── TidMidPage.ts
│   ├── MerchantCreatePage.ts
│   ├── DocumentAppraisalPage.ts
│   └── ContractCreatePage.ts
├── data/                   # Dữ liệu test tách riêng khỏi logic
│   └── merchantData.ts     # Hàm sinh data merchant (buildMerchants)
├── fixtures/               # File tĩnh dùng để upload (dummy.png)
├── playwright.config.ts    # Cấu hình test thường: baseURL, report, trace, auth
├── seed.config.ts          # Cấu hình riêng cho seed (inject token, 1 worker)
├── .env.example            # Mẫu biến môi trường (copy thành .env)
└── package.json
```

> **Nguyên tắc POM:** locator + thao tác nằm trong `pages/*`; file test chỉ ra lệnh mức cao.
> UI đổi → chỉ sửa trong Page tương ứng, không phải sửa từng test.

## Cài đặt lần đầu (chạy 1 lần)
```bash
cd /Users/vyvy/cms-automation
npm install                 # cài Playwright + thư viện
npx playwright install      # tải trình duyệt (Chromium...)
cp .env.example .env        # tạo file .env
# → Mở .env, điền CMS_USERNAME và CMS_PASSWORD thật
```

## Chạy test
```bash
npm test            # chạy tất cả test (ẩn trình duyệt)
npm run test:headed # chạy và XEM trình duyệt thao tác
npm run test:ui     # chế độ UI (xem từng bước, debug dễ)
npm run report      # mở báo cáo HTML sau khi chạy
```

## Mẹo học nhanh
```bash
npm run codegen     # mở app, bấm tay → Playwright TỰ SINH code + selector
```
Dùng codegen để lấy selector đúng cho `LoginPage.ts` (mấy selector đang để tạm).

## Các bước tiếp theo (gợi ý)
1. Sửa selector trong `pages/LoginPage.ts` cho khớp màn login thật (dùng codegen).
2. Chạy `npm test` — test login + TID/MID phải xanh.
3. Viết thêm Page Object cho màn Danh sách hợp đồng, rồi thêm test search/filter.
4. Khi quen: thêm test regression cho các bug đã từng xảy ra (vd CMS-211).

> ⚠️ Chỉ chạy trên môi trường **Staging/test**, KHÔNG chạy lên production.
> ⚠️ Tránh tự động hoá luồng gửi mail/ký số/đổi trạng thái thật khi chưa có dữ liệu test riêng.
