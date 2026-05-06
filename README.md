# 宠瑾安

预约制猫犬护理门店单页网站。页面负责展示品牌、护理项目、空间环境、服务价格、客户反馈、门店位置，并通过预约表单把用户信息提交到后端。

## 当前能力

- 单页官网：首页内容来自 `app/legacy-content.html`，由 Next.js 渲染。
- 品牌图标：浏览器标签页、收藏图标和页面左上角统一使用 `public/assets/images/brand-chongjinan-dog-mark.png`。
- 预约默认时间：访问页面时自动填入“当前访问时间 + 1 天”，并限制不能选择过去时间。
- 表单提交：浏览器提交到 `/api/appointments`，前端不直接连接 Supabase。
- 数据写入：Next.js 后端接口转发到 Supabase Edge Function `create-appointment`，由函数写入 `public.appointments`。
- 交互反馈：提交中会禁用按钮；成功或失败会在右下角弹出状态提示，并保留表单下方状态文案。
- 轮播体验：护理空间和客户评价都使用无感循环，不会在最后一张倒带回第一张。

## 技术栈

- Next.js App Router
- React 19
- TypeScript
- Tailwind CSS 3
- Supabase Edge Functions
- Playwright
- PowerShell 启动脚本

## 本地运行

安装依赖：

```powershell
npm install
```

启动开发服务：

```powershell
npm run dev
```

开发地址固定为：

```text
http://127.0.0.1:3000
```

`npm run dev` 会检查 `127.0.0.1:3000` 是否已有旧进程占用。如果有，会停止旧进程再启动新服务。这个脚本不会删除 `.next` 或其他目录。

生产构建：

```powershell
npm run build
```

生产启动：

```powershell
npm run start
```

## 预约链路

当前发布链路是：

```text
浏览器表单 -> Next.js /api/appointments -> Supabase Edge Function -> public.appointments
```

说明：

- 默认 Edge Function 地址写在 `app/api/appointments/route.ts`。
- 如需切换 Supabase 项目或函数地址，在 `.env.local` 设置 `SUPABASE_CREATE_APPOINTMENT_URL`。
- `.env.local` 可以保留真实数据库连接串或其他本地配置，但不能提交。
- 当前预约提交不依赖浏览器直连 Supabase，也不依赖本机 PostgreSQL Direct connection。

## 发布前检查

每次准备推送或部署前，至少执行：

```powershell
npm run build
```

浏览器验证建议覆盖：

- 首屏品牌、导航、主按钮和预约卡片正常显示。
- 期望到店时间默认显示为访问时间加一天。
- 表单提交成功后出现右下角成功提示。
- 护理空间轮播可前后切换。
- 客户评价轮播从最后一条继续下一条时顺滑回到第一条。
- 移动端视口下导航、表单、轮播按钮和地图不溢出。

## 设计标准

项目视觉和交互按“清晰、克制、内容优先”的高端服务页标准维护：

- 内容层级清楚：首屏先让用户知道品牌、服务和预约入口。
- 控件足够好点：按钮和表单在移动端保持明确触达面积。
- 反馈及时：提交中、成功、失败都要有清楚但不过度打扰的提示。
- 动效有分寸：轮播和按钮动效只服务于状态变化，并尊重 `prefers-reduced-motion`。
- 图像真实服务内容：优先使用能说明空间、护理、位置和品牌的真实图片或高质量生成图，不使用无意义装饰。
- 品牌一致：logo、标题、按钮、色彩、圆角和阴影要保持统一，不混入默认模板风格。

## 关键文件

- `app/legacy-content.html`：页面主体内容、文案、区块顺序、图片引用。
- `app/pet-care-interactions.tsx`：预约默认时间、轮播、表单提交、toast 反馈。
- `app/api/appointments/route.ts`：预约后端接口和 Supabase Edge Function 转发。
- `app/globals.css`：全局视觉、布局、按钮、表单、轮播、响应式。
- `app/page.tsx`：读取 HTML，并在服务端注入预约默认时间。
- `app/layout.tsx`：页面标题、描述、品牌图标等元数据。
- `public/assets/images/`：页面图片和品牌 logo。
- `scripts/dev.ps1`：固定 3000 端口的本地开发启动脚本。
- `AGENTS.md`：给后续维护者和 AI 助手看的项目规则。

## 不入库内容

以下内容属于依赖、缓存、运行日志、构建产物、本地验证产物或密钥，不应提交：

- `node_modules/`
- `.next/`
- `out/`
- `dist/`
- `build/`
- `coverage/`
- `output/`
- `.vercel/`
- `.env*`
- `.next-dev.log`
- `.next-dev.err.log`
- `.next-start-*.log`
- `.next-start-*.err.log`
- `*.tsbuildinfo`

## 品牌口径

- 品牌名：宠瑾安。
- 页面副标：猫犬护理。
- 品牌气质：干净、稳定、有分寸，强调清洁、轮廓、状态。
- 当前电话仍是占位值：`138 0000 0000` / `tel:13800000000`，正式上线前需要替换成真实电话。
