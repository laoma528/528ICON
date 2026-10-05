# 528 图标助手

> 🎨 基于 xAI 设计风格的高清应用图标下载工具

从 App Store 获取高清 PNG 应用图标 logo，支持多国家/地区、多平台、多分辨率。

## ✨ 特性

- 🔍 **智能搜索** - 支持应用名称、App Store 链接、App ID
- 🌍 **多地区支持** - 覆盖全球 20+ 国家和地区
- 📱 **多平台** - iOS、iPadOS、macOS 应用
- 🎯 **高清图标** - 最高 1024px 分辨率
- 🖼️ **多格式** - JPEG、PNG、WebP
- 🎨 **xAI 设计风格** - 极简黑白美学
- 🌓 **双主题模式** - 深色/浅色自由切换
- 🇨🇳 **中英双语** - 界面语言一键切换

## 🚀 在线访问

**主站：** https://icon.528.im

## 📖 使用方法

### 基础搜索

在搜索框中输入：
- **应用名称**：如 `Google`、`微信`
- **App Store 链接**：如 `https://apps.apple.com/cn/app/wechat/id414478124`
- **App ID**：如 `414478124`

### 完整示例

```
https://icon.528.im/?name=Google&country=us&entity=software&limit=18&cut=2&resolution=1024&format=webp
```

### 地区智能识别

- 粘贴 App Store 链接时，自动识别链接中的地区
- 例如：`https://apps.apple.com/sg/app/siri/id6758482875` 会查询新加坡区
- 只输入 App ID（如 `6758482875`）时使用当前选择的地区
- URL 中的 `country` 参数优先于链接地区

💡 **提示**：部分应用不在所有地区上架，搜索不到时请切换地区或粘贴对应地区的链接。

## ⚙️ URL 参数

|  参数名    |                     说明                         |  默认值  | 可选值 |
| :--------: | :----------------------------------------------: | :------: | :----- |
|    name    |             应用名称、链接或 App ID              |    无    | 任意文本 |
|  country   |            国家/地区                             |    cn    | cn, us, jp, kr, tw, hk, sg 等 |
|   entity   | 搜索平台 | software | software (iOS), iPadSoftware (iPadOS), desktopSoftware (macOS) |
|   limit    |              搜索结果数量                         |    18    | 1-200 |
|    cut     |         图标样式                                  |    2     | 0 (原图), 1 (标准), 2 (官方) |
| resolution |              分辨率                               |   512    | 256, 512, 1024 |
|   format   |             图片格式                              |   png    | jpeg, png, webp |

## 🛠️ 技术栈

- **框架**：React 19 + Vite 6
- **样式**：纯 CSS（基于 xAI 设计系统）
- **API**：iTunes Search API
- **部署**：静态网站托管（支持 1Panel、Vercel、GitHub Pages 等）

## 🎨 设计规范

本项目采用 [xAI 设计系统](https://getdesign.md/x.ai/design-md)，实现了：

- ✅ **极简黑白配色** - 纯净视觉
- ✅ **Inter 字体** - 现代几何无衬线
- ✅ **Pill 形状** - 圆润按钮和输入框
- ✅ **8px 卡片圆角** - 精致细节
- ✅ **1px Hairline 边框** - 无阴影设计
- ✅ **橙色点缀** - 高辨识度交互

详见：[xAI 设计规范对照](docs/xai-design-final.md)

## 📦 本地开发

### 环境要求

- Node.js 18+
- npm 或 pnpm

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问：http://localhost:5173

### 构建生产版本

```bash
npm run build
```

构建产物在 `dist` 目录。

## 🚀 部署指南

详见：[1Panel 静态网站部署文档](docs/1panel-deployment.md)

支持部署到：
- ✅ 1Panel (OpenResty)
- ✅ Vercel
- ✅ Netlify
- ✅ GitHub Pages
- ✅ 任何静态网站托管服务

## 🙏 致谢

### 原项目
本项目基于以下开源项目改进：
- [YuKongA/HQ-ICON](https://github.com/YuKongA/HQ-ICON) - 原始项目
- [f48vj/hq-icon](https://github.com/f48vj/hq-icon) - 早期版本

### 设计系统
- [xAI Design System](https://getdesign.md/x.ai/design-md) - 设计规范
- [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md) - 设计资源

### 技术栈
- [React](https://react.dev/) - UI 框架
- [Vite](https://vitejs.dev/) - 构建工具
- [iTunes Search API](https://performance-partners.apple.com/search-api) - 数据来源
- [Inter Font](https://rsms.me/inter/) - 字体

### 参考资源
- [Country Codes](https://en.wikipedia.org/wiki/Country_code) - 国家代码

## 📄 开源协议

MIT License

---

**🌟 如果这个项目对你有帮助，欢迎 Star！**
