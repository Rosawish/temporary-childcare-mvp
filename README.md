# 臨時短托 MVP

第一階段先完成家長端一條可 Demo 的完整流程，資料使用 mock JSON + `localStorage`，暫不接 PostgreSQL / Prisma。確認前端流程後，再進入正式資料庫、API Routes 與權限 middleware。

## 1. 建議專案架構

```text
app/
  parent/
    login
    dashboard
    children
    search
    centers/[id]
    bookings/new
    bookings/[id]
    bookings/[id]/status
    bookings/[id]/camera
    bookings/[id]/payment
    bookings/[id]/review
  provider/
    login
    bookings
    bookings/[id]
components/
  AppShell.tsx
lib/
  mockData.ts
  store.ts
  types.ts
```

目前 demo 以 client-side store 模擬 API 與 DB 行為。第二階段建議新增：

```text
prisma/schema.prisma
prisma/seed.ts
app/api/**/route.ts
lib/auth.ts
lib/prisma.ts
middleware.ts
```

## 2. Prisma schema

第二階段再落地到 `prisma/schema.prisma`。資料表會對應：`parent_users`、`child_profiles`、`provider_users`、`admin_users`、`childcare_centers`、`center_documents`、`staff_profiles`、`environment_photos`、`service_plans`、`availability_slots`、`bookings`、`booking_status_logs`、`care_status_logs`、`camera_feeds`、`camera_access_logs`、`payments`、`reviews`。

Enum 會包含：`BookingStatus`、`ReviewStatus`、`PaymentStatus`、`PaymentMethod`、`ServiceType`、`CareStatusType`、`UserRole`。所有主要資料表使用 UUID primary key。

## 3. Seed data 設計

Seed data 目前位於 `lib/mockData.ts`：

- 家長：林怡安、陳柏宏
- 孩子：小安、小恩
- 機構：幸福小屋短託、小星星課後照顧中心、安心寶貝臨托站
- 照顧人員 5 位
- 合法文件 6 筆，含 `approved`、`pending`、`needs_revision`、`expired`
- 服務方案 3 筆
- 可預約時段 6 筆
- camera feeds 3 筆，其中 2 筆可開放給家長
- 預約 3 筆
- paid payment 1 筆
- reviews 2 筆

## 4. API route 設計

第一階段尚未建立 API Routes；目前由 `lib/store.ts` 模擬。第二階段會補：

家長端：

- `POST /api/parents/register`
- `POST /api/parents/login`
- `GET /api/parents/me`
- `GET|POST /api/children`
- `PUT|DELETE /api/children/:id`
- `GET /api/centers/search`
- `GET /api/centers/:id`
- `POST /api/bookings`
- `GET /api/bookings/:id`
- `POST /api/bookings/:id/cancel`
- `GET /api/bookings/:id/care-logs`
- `GET /api/bookings/:id/cameras`
- `POST /api/payments/mock-pay`
- `POST /api/reviews`

機構端：

- `POST /api/providers/login`
- `GET|PUT /api/provider/center`
- `GET|POST /api/provider/documents`
- `POST|PUT|DELETE /api/provider/staff/:id`
- `GET|POST /api/provider/service-plans`
- `GET|POST /api/provider/availability`
- `GET /api/provider/bookings`
- `GET /api/provider/bookings/:id`
- `POST /api/provider/bookings/:id/checkin`
- `POST /api/provider/bookings/:id/in-care`
- `POST /api/provider/bookings/:id/ready-pickup`
- `POST /api/provider/bookings/:id/checkout`
- `POST /api/provider/bookings/:id/care-logs`
- `GET|POST /api/provider/cameras`

管理員端：

- `POST /api/admin/login`
- `GET /api/admin/centers/pending`
- `GET /api/admin/centers`
- `POST /api/admin/centers/:id/approve`
- `POST /api/admin/centers/:id/reject`
- `POST /api/admin/centers/:id/suspend`
- `POST /api/admin/documents/:id/review`
- `POST /api/admin/staff/:id/review`
- `POST /api/admin/cameras/:id/review`
- `GET /api/admin/bookings`
- `GET /api/admin/payments`
- `GET /api/admin/reviews`

## 5. 前端頁面設計

家長端已完成：

- `/parent/login`
- `/parent/dashboard`
- `/parent/children`
- `/parent/search`
- `/parent/centers/[id]`
- `/parent/bookings/new`
- `/parent/bookings/[id]`
- `/parent/bookings/[id]/status`
- `/parent/bookings/[id]/camera`
- `/parent/bookings/[id]/payment`
- `/parent/bookings/[id]/review`

機構端第一階段已完成：

- `/provider/login`
- `/provider/bookings`
- `/provider/bookings/[id]`

## 6. 權限與 middleware 設計

第一階段使用 `localStorage` 模擬登入狀態。

已實作監控權限檢查：

- 家長必須登入
- booking 必須屬於目前家長
- booking status 必須為 `checked_in` 或 `in_care`
- camera feed 必須為 `isOpenArea = true`
- camera feed 必須 `reviewStatus = approved`
- camera feed 必須啟用
- 只能在服務時段內查看
- 同意隱私告知後才顯示 iframe
- 每次同意查看都建立 `cameraAccessLogs`

第二階段建議使用 JWT cookie + `middleware.ts` 做 parent/provider/admin route guard。

## 7. 第一階段開發步驟

1. 建立 Next.js + TypeScript + Tailwind 專案。
2. 建立 mock data 與型別。
3. 建立 client store，模擬登入、預約、狀態更新、付款、評價。
4. 完成家長端登入、首頁、孩子資料、搜尋、詳情、預約。
5. 完成機構端預約管理、報到、照顧紀錄與完成接回。
6. 完成家長端狀態、監控、付款與評價。
7. 以 README 指引跑通 Demo。

## 8. 每個步驟建立或修改的檔案

- 專案設定：`package.json`、`next.config.ts`、`tsconfig.json`、`tailwind.config.ts`、`postcss.config.mjs`
- 樣式與 layout：`app/globals.css`、`app/layout.tsx`、`components/AppShell.tsx`
- Mock data：`lib/types.ts`、`lib/mockData.ts`、`lib/store.ts`
- 家長端：`app/parent/**/page.tsx`
- 機構端：`app/provider/**/page.tsx`
- 文件：`README.md`

## 9. 安裝、啟動、seed data、測試方式

安裝：

```bash
pnpm install
```

啟動：

```bash
pnpm dev
```

或使用虛擬網域 demo：

```bash
pnpm dev:domain
```

開啟：

```text
http://temporary-childcare.localhost:3000/parent/login
```

`temporary-childcare.localhost` 會解析到本機，不需要修改 `/etc/hosts`。若瀏覽器環境不支援 `.localhost` 子網域，可改用：

```text
http://localhost:3000/parent/login
```

家長 Demo 帳號：

```text
parent@example.com
password123
```

機構 Demo 帳號：

```text
provider@example.com
password123
```

管理員 Demo 帳號：

```text
admin@example.com
password123
```

管理員儀錶板：

```text
http://temporary-childcare.localhost:3000/admin/login
http://temporary-childcare.localhost:3000/admin/dashboard
```

重置 seed data：

- 到 `/parent/login`
- 點選「重置 Demo 資料」

建議 Demo 流程：

1. 家長林怡安登入。
2. 到首頁確認孩子小安。
3. 點「今日臨時短託」。
4. 選擇幸福小屋短託。
5. 查看合法文件、老師資料、價格、剩餘名額。
6. 建立今日 16:30–18:00 預約。
7. 查看老師通知模板。
8. 到 `/provider/login` 登入機構端。
9. 到預約詳情，把狀態改為 `checked_in`，再改為 `in_care`。
10. 回家長端孩子狀態頁，確認已抵達與照顧紀錄。
11. 到監控頁，同意隱私告知後查看 mock iframe。
12. 機構端改為 `completed`。
13. 家長端完成 mock payment。
14. 家長端留下評價。

測試：

```bash
pnpm build
```

Dashboard API 權限測試：

```bash
# 未登入，應回 401
curl -s -o /dev/null -w "%{http_code}" \
  http://temporary-childcare.localhost:3000/api/admin/dashboard/overview

# parent / provider，應回 403
curl -s -o /dev/null -w "%{http_code}" \
  -H "x-demo-role: parent" \
  http://temporary-childcare.localhost:3000/api/admin/dashboard/overview

curl -s -o /dev/null -w "%{http_code}" \
  -H "x-demo-role: provider" \
  http://temporary-childcare.localhost:3000/api/admin/dashboard/overview

# admin，應回 200
curl -s -o /dev/null -w "%{http_code}" \
  -H "x-demo-role: admin" \
  http://temporary-childcare.localhost:3000/api/admin/dashboard/overview
```

## 第二階段：平台經營儀錶板

已完成第一版 `/admin/dashboard` 一頁式總覽：

- KPI Cards：會員、孩子、機構、可預約機構、預約、本月預約、累計營收、本月營收、平均客單價、完成率、平均評分、待審核文件、即將到期文件、未處理事件、監控查看次數、活躍家長率
- 圖表：營收趨勢、預約趨勢、機構預約 Top 10、預約狀態分布、付款狀態分布、評價分布
- 表格：待處理事項、機構營運排名、最近預約列表
- API：`/api/admin/dashboard/overview`、`revenue-trend`、`booking-trend`、`top-centers`、`status-distribution`、`camera-usage`、`action-items`、`recent-bookings`
- 權限：dashboard API 使用 demo admin cookie 或 `x-demo-role: admin`，未登入回 `401`，非 admin 回 `403`

Dashboard metrics 集中在：

```text
lib/admin/dashboardMetrics.ts
```

第二階段仍使用 mock seed data，尚未接 PostgreSQL。Seed 已擴充為 20 位家長、30 筆孩子、8 間機構、20 位照顧人員、30 筆文件、100 筆預約、80 筆付款、45 筆評價、100 筆監控查看與 10 筆事件，並分布於最近 12 個月。

Prisma 銜接時需補強欄位：

- `bookings`: `platform_fee_amount`、`provider_revenue_amount`、`commission_rate`、`cancelled_at`
- `payments`: `refunded_amount`
- `parent_users`: `last_login_at`
- `childcare_centers`: `is_bookable`
- 新增或確認 `incident_reports`

## 10. 後續可擴充功能建議

- 接上 Prisma + PostgreSQL，將 mock store 換成 API Routes。
- 使用 JWT httpOnly cookie，加入 parent/provider/admin middleware。
- 建立管理員審核後台。
- 加入取消規則與自動回補名額。
- 加入真實付款 provider。
- 串接地圖與距離排序。
- 加入簡訊、Email、Line 通知。
- 加入申訴、退款、發票與營運報表。
