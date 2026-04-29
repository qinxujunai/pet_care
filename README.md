# 宠瑾安

Next.js App Router + TypeScript + Tailwind 项目。

## 运行

```powershell
npm install
npm run dev
```

本地地址固定为：

```text
http://127.0.0.1:3000
```

如果页面看起来和代码不一致，先停掉旧的 dev 进程，再运行：

```powershell
npm run dev:fresh
```

## 项目源

- 页面内容只维护 `app/legacy-content.html`。
- 交互逻辑只维护 `app/pet-care-interactions.tsx`。
- 全局样式只维护 `app/globals.css`。
- 图片资源只从 `public/assets/images/` 读取。

不要再使用根目录静态 `index.html` 或根目录 `assets/`。它们是迁移前来源，已经移除，避免和 Next.js 运行结果不一致。

## 品牌口径

- 品牌名：宠瑾安
- 页面副标：猫犬护理
- 核心语气：清洁、轮廓、状态、分寸；避免拼音、英文副标和模板化高端词。
- 品牌头像：`public/assets/images/brand-chongjinan-dog-mark.png`
