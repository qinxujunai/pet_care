# 宠瑾安

预约制猫犬护理门店页面，使用 Next.js App Router、TypeScript 和 Tailwind CSS 构建。

## 运行

```powershell
npm install
npm run dev
```

本地开发地址固定为：

```text
http://127.0.0.1:3000
```

如果页面看起来和代码不一致，先停掉旧的 dev 进程，再运行：

```powershell
npm run dev:fresh
```

生产构建与启动：

```powershell
npm run build
npm run start
```

## 维护边界

- 页面内容维护在 `app/legacy-content.html`。
- 页面交互维护在 `app/pet-care-interactions.tsx`。
- 全局样式维护在 `app/globals.css`。
- 页面元数据维护在 `app/layout.tsx`。
- 图片资源统一放在 `public/assets/images/`，页面中使用 `/assets/images/...` 访问。
- 当前电话链接仍是占位值 `13800000000`，上线前需要替换为真实门店电话。

## 不入库内容

以下内容属于本地依赖、构建缓存、运行日志或验证截图，不需要提交：

- `node_modules/`
- `.next/`
- `.next-dev.log`
- `.next-dev.err.log`
- `output/`
- `.env*`

## 品牌口径

- 品牌名：宠瑾安
- 页面副标：猫犬护理
- 核心语气：清洁、轮廓、状态、分寸；避免拼音、英文副标和模板化高端词。
- 品牌头像：`public/assets/images/brand-chongjinan-dog-mark.png`
