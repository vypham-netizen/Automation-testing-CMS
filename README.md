# CMS Automation (Playwright + TypeScript)

Framework test tự động cho hệ thống **CMS POS**.

## Cấu trúc (Page Object Model)
```
cms-automation/
├── config/
│   └── env.ts              # CONFIG SWITCH môi trường (local|staging) — TEST_ENV
├── tests/
│   ├── auth.setup.ts       # Đăng nhập 1 lần, lưu session
│   ├── login.spec.ts       # Smoke: vào được màn chính
│   ├── tid-mid.spec.ts     # Test màn Quản lý TID/MID
│   ├── seed.spec.ts        # Seed: tạo MC → thẩm định → ký HĐ
│   └── e2e-tid-flow.spec.ts# E2E v1.5: MC → HĐ → TID (gửi bank → tạm hoãn → hủy)
├── pages/                  # Page Object Model (mỗi màn 1 class)
│   ├── BasePage.ts         # helper chung (dropdown, search-select, thao tác dòng)
│   ├── LoginPage.ts · TidMidPage.ts · MerchantCreatePage.ts
│   ├── DocumentAppraisalPage.ts · ContractCreatePage.ts
│   └── doisoat/            # SCAFFOLD v2.0 (đối soát — màn chưa build, khung sẵn)
│       ├── CaDoiSoatPage.ts · GiaoDichPage.ts · DeXuatThanhToanPage.ts
│       └── HoldPage.ts · TruyThuPage.ts · TTBSPage.ts
├── data/merchantData.ts    # Hàm sinh data merchant (buildMerchants)
├── fixtures/dummy.png      # File tĩnh để upload
├── playwright.config.ts    # Test thường (auth.setup + login/tid-mid)
├── seed.config.ts          # Seed (inject token)
├── e2e.config.ts           # E2E luồng đầy đủ (inject token)
└── .env.example
```

> **Nguyên tắc POM:** locator + thao tác nằm trong `pages/*`; file test chỉ ra lệnh mức cao.

## Chuyển môi trường (local ↔ staging)
Sửa `TEST_ENV` trong `.env` (`local` hoặc `staging`) hoặc truyền khi chạy:
```bash
TEST_ENV=staging npm run e2e        # chạy E2E trên staging
TEST_ENV=local   npm run seed       # seed trên local
```
`config/env.ts` chọn `BASE_URL` + token + thông số hợp đồng (bank/ngành) theo từng môi trường.
Bước gửi mail trong E2E chỉ chạy khi `SEND_MAIL=1` (vì gửi mail tới đại lý — chỉ bật khi đại lý dùng hòm test).

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
npm test            # test thường (login + TID/MID)
npm run seed        # seed merchant + hợp đồng (SEED_COUNT=5 mặc định)
npm run e2e         # E2E luồng đầy đủ MC→HĐ→TID
npm run e2e:headed  # ... và XEM trình duyệt chạy
npm run report      # mở báo cáo HTML
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
