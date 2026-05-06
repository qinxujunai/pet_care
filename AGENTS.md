# AGENTS.md

## 硬性操作规则

禁止批量删除文件或目录。

不要使用：

- `del /s`
- `rd /s`
- `rmdir /s`
- `Remove-Item -Recurse`
- `rm -rf`

需要删除文件时，只能一次删除一个明确路径的文件。

正确示例：

```powershell
Remove-Item "C:\path\to\file.txt"
```

如果需要批量删除文件，应停止操作，并向用户请求，让用户手动删除。

## 使用者信息

- 使用者叫菌子。
- 菌子擅长 Python 和 Java。
- 菌子对 CSS 不熟；解释网页样式时要用大白话，少讲术语，多说“这段样式让页面哪里变成什么样”。

## 项目一句话

这是一个名为“宠瑾安”的预约制猫犬护理门店页面，用来展示门店品牌、护理项目、空间环境、价格、客户反馈、门店位置，并提供预约表单入口。

## 当前项目状态

- 这是一个已经初始化过的 Next.js 项目，不是空文件夹。
- 当前主要是一个单页网站。
- 页面内容主要写在 `app/legacy-content.html`，再由 `app/page.tsx` 读取并渲染。
- 页面交互由客户端 React 组件 `app/pet-care-interactions.tsx` 负责。
- 预约表单提交到 Next.js 后端接口 `/api/appointments`，再转发到 Supabase Edge Function 写入预约表。
- 图片资源放在 `public/assets/images/`。
- 本地依赖、构建缓存和运行日志已经存在，例如 `node_modules/`、`.next/`、各种 `.log` 文件；这些不是核心源码。

## 技术栈

- Next.js App Router：负责把页面和后端接口作为网站运行起来。
- React 19：负责客户端交互组件。
- TypeScript：给代码加类型检查。
- Tailwind CSS 3：项目启用了 Tailwind，但当前大量样式集中写在 `app/globals.css`。
- Supabase Edge Functions：负责实际写入预约表。
- PowerShell 脚本：`scripts/dev.ps1` 用来停止旧的 3000 端口开发服务，并固定启动到 3000 端口。
- Playwright：用于发布前浏览器验证。

## 设计和交互标准

按高端服务页和 Apple HIG 接近的“清晰、克制、内容优先”方向维护：

- 首屏必须马上看得出品牌、服务类型和预约入口。
- UI 不要堆装饰，不要用无意义渐变或装饰块抢内容。
- 表单、按钮、轮播箭头在移动端要足够好点。
- 所有交互都要有状态：悬停、焦点、点击、禁用、提交中、成功、失败。
- 动效要克制，只用于说明状态变化，并尊重 `prefers-reduced-motion`。
- 图片必须服务内容：品牌 logo、护理空间、护理状态、地图位置优先，不用空泛素材。
- 视觉保持统一：品牌 logo、色彩、圆角、阴影、字体、按钮风格不能混入默认模板感。

## 关键文件分工

- `app/page.tsx`
  - 网站首页入口。
  - 读取 `app/legacy-content.html`，通过 `dangerouslySetInnerHTML` 把 HTML 放进页面。
  - 在服务端给预约时间写入“当前访问时间 + 1 天”的默认值。
  - 挂载 `PetCareInteractions` 负责交互。

- `app/legacy-content.html`
  - 页面主体内容。
  - 包含导航、首屏、预约表单、护理项目、护理空间轮播、价格、客户反馈轮播、门店位置和页脚。
  - 改文案、页面板块、链接、图片引用，通常先看这里。

- `app/pet-care-interactions.tsx`
  - 页面交互逻辑。
  - 同步预约时间默认值，并设置最小可选时间为当前时间。
  - 负责店内环境轮播、客户评价无感循环轮播、轮播按钮、圆点状态、鼠标悬停暂停。
  - 负责把预约表单提交到 `/api/appointments`，并在右下角显示成功或失败提示。

- `app/api/appointments/route.ts`
  - 预约后端接口。
  - 接收 JSON 或普通表单提交。
  - 转发到 Supabase Edge Function `create-appointment`。
  - 不直接依赖本机 PostgreSQL Direct connection。
  - 前端只显示通用失败提示，详细错误写入后端日志。

- `app/globals.css`
  - 全局样式。
  - 控制页面颜色、字体、间距、按钮、首屏、卡片、轮播、价格区、评价区、地图区、移动端适配、可访问性焦点态和减少动画偏好。
  - 给菌子解释这里时，要翻译成白话：比如“这一段是在控制顶部导航的高度和固定效果”，不要只说 CSS 属性名。

- `app/layout.tsx`
  - 全站外壳、页面元数据和浏览器标签页品牌图标。

- `public/assets/images/`
  - 图片目录。
  - 页面中通过 `/assets/images/...` 访问这些图片。

- `scripts/dev.ps1`
  - 开发启动脚本。
  - 检查 `127.0.0.1:3000` 是否已有进程占用。
  - 如果端口被占用，会停止占用进程。
  - 不会删除 `.next` 或其他目录。
  - 然后运行 `npx next dev --hostname 127.0.0.1 --port 3000`。

- `README.md`
  - 面向人看的运行和维护说明。
  - 必须和真实启动方式、数据库连接方式、设计标准、维护边界保持同步。

## 数据库和预约写入

- 预约表是 Supabase 里的 `public.appointments`。
- 浏览器前端不直接连接 Supabase。
- 表单提交到 `/api/appointments`。
- `/api/appointments` 调用 Supabase Edge Function `create-appointment`。
- Edge Function 使用 Supabase 后端环境写入 `public.appointments`。
- 如需切换函数地址，在 `.env.local` 设置 `SUPABASE_CREATE_APPOINTMENT_URL`。
- `.env.local` 放真实连接串或本地密钥，不能提交。

## 运行命令

常规启动：

```powershell
npm install
npm run dev
```

开发地址：

```text
http://127.0.0.1:3000
```

生产构建和启动：

```powershell
npm run build
npm run start
```

## 发布前验证

每次提交或推送前，至少确认：

- `npm run build` 通过。
- 首页能在 `http://127.0.0.1:3000` 正常打开。
- 浏览器标签页显示宠瑾安品牌 logo，不是默认 Next/Vercel 图标。
- 预约时间默认值是访问时间加一天。
- 预约表单可以提交，成功/失败有明确反馈。
- 客户评价轮播从最后一条继续下一条时不会倒带。
- 移动端下导航、预约卡片、轮播和地图不溢出。
- `.env.local`、日志、缓存、截图、构建产物没有进入提交。

## 维护规则

- 改正文内容、页面顺序、图片引用：优先改 `app/legacy-content.html`。
- 改按钮点击、轮播、表单反馈、自动时间：优先改 `app/pet-care-interactions.tsx`。
- 改预约入库、字段校验、数据库写入：优先改 `app/api/appointments/route.ts`。
- 改颜色、大小、间距、响应式布局：优先改 `app/globals.css`。
- 改页面标题、搜索描述和浏览器标签页图标：改 `app/layout.tsx`。
- 新图片放到 `public/assets/images/`，页面里用 `/assets/images/文件名` 引用。
- 不要把 `node_modules/`、`.next/`、`output/`、`.log` 文件当作源码维护。
- 不要随手改生成文件或运行日志。
- 修改前先看当前文件真实内容，不要凭 Next.js 默认项目经验猜。

## 给后续助手的工作方式

- 先给结论，再讲原因。
- 如果涉及 CSS，必须用大白话解释视觉效果。
- 如果用户只要求改某一个文件，就只改那个文件。
- 不要无故初始化新框架、安装新依赖或创建额外文件。
- 不要声称已经验证，除非真的运行过命令或看过浏览器结果。
- 如果发现已有未提交改动，不要擅自回滚；先判断是不是用户正在做的改动。

## 不应该提交的内容

这些内容属于依赖、缓存、运行日志、构建产物、本地验证产物或密钥：

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
