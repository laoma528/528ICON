# 1Panel 静态网站部署文档

本文档介绍如何在配置了 1Panel 面板的服务器上部署 HQ-ICON 项目。

## 环境说明

### 开发环境
- **操作系统**: Windows 11
- **代码编辑器**: VSCode + Claude Code 扩展 或 Claude Desktop
- **Node.js**: 推荐 18.x 或更高版本
- **包管理器**: npm

### 生产环境
- **服务器位置**: 香港云服务器
- **管理面板**: 1Panel
- **Web 服务器**: OpenResty 容器
- **部署方式**: 静态文件托管

## 前置要求

- 一台安装了 1Panel 面板的服务器（推荐香港或海外节点，访问 Apple API 更稳定）
- 本地安装了 Node.js 和 npm
- 服务器已开放 80/443 端口（或其他自定义端口）

## 部署步骤

### 1. 本地构建项目

在项目根目录下执行：

```bash
# 安装依赖
npm install

# 构建生产版本
npm run build
```

构建完成后会生成 `dist` 目录，包含所有静态文件。

### 2. 打包构建产物

将 `dist` 目录打包：

**Windows:**
```bash
# 使用 PowerShell 或右键压缩
Compress-Archive -Path dist\* -DestinationPath dist.zip
```

**Linux/macOS:**
```bash
cd dist
zip -r ../dist.zip .
cd ..
```

### 3. 上传到服务器

#### 方式 A: 通过 1Panel 文件管理器上传

1. 登录 1Panel 面板
2. 进入 **文件** → **文件管理**
3. 进入网站目录，默认路径为：`/home/www/sites/你的域名/index`
   - 例如：`/home/www/sites/icon.528.im/index`
4. 上传 `dist.zip` 到该目录
5. 在 1Panel 文件管理器中右键解压 `dist.zip`

#### 方式 B: 通过 SSH/SFTP 上传

```bash
# 使用 scp 上传（替换为你的实际路径）
scp dist.zip root@your-server-ip:/home/www/sites/icon.528.im/index/

# SSH 登录后解压
ssh root@your-server-ip
cd /home/www/sites/icon.528.im/index
unzip dist.zip
```

### 4. 在 1Panel 创建网站

1. 登录 1Panel 面板
2. 进入 **网站** → **网站** → 点击 **创建网站**
3. 填写配置：

   **基本信息:**
   - **主域名**: 你的域名（例如 `icon.yourdomain.com`）或留空使用 IP 访问
   - **备用域名**: 可选，添加其他访问域名
   - **网站类型**: 选择 **静态网站**
   - **端口**: `80`（或自定义端口）

   **网站目录:**
   - **根目录**: 选择网站目录，1Panel 默认为 `/home/www/sites/你的域名/index`
   - **运行用户**: 默认 `www`

   **其他配置:**
   - **代理缓存**: 不需要
   - **日志**: 可选开启，方便调试

4. 点击 **确认** 创建

### 5. 访问网站

- **通过 IP 访问**: `http://your-server-ip`
- **通过域名访问**: `http://icon.yourdomain.com`（需先配置 DNS 解析）

## 配置 HTTPS（可选但推荐）

### 使用 Let's Encrypt 免费证书

1. 在 1Panel 网站管理中，找到刚创建的网站
2. 点击 **证书** → **申请证书**
3. 选择 **Let's Encrypt**
4. 填写邮箱，选择验证方式（推荐 DNS 验证）
5. 申请成功后，1Panel 会自动配置 HTTPS

### 或上传已有证书

1. 点击 **证书** → **上传证书**
2. 上传你的 `.crt` 和 `.key` 文件
3. 1Panel 会自动配置 HTTPS

## 更新部署

当项目有更新时：

1. 本地重新构建：`npm run build`
2. 打包新的 `dist.zip`
3. 上传到服务器 `/home/www/sites/你的域名/index/` 替换旧文件
4. 在 1Panel 中点击网站的 **重启** 按钮（清除缓存）

**提示**：可以先删除旧的文件再上传新的，避免文件冲突。

## 故障排查

### 网站无法访问

- 检查服务器防火墙是否开放对应端口
- 检查 1Panel 中网站是否正常运行
- 检查 Nginx 配置是否正确（1Panel 会自动生成，一般不需要手动修改）

### 图标加载失败

- 检查浏览器控制台，查看是否有 API 请求失败
- Apple iTunes API (`https://itunes.apple.com`) 在部分地区可能被限速或屏蔽
- 推荐使用香港或海外服务器部署

### 页面样式错乱

- 检查 `dist` 目录中的文件是否完整
- 清除浏览器缓存后重试
- 检查 Nginx 是否正确配置了 MIME 类型（1Panel 默认配置正确）

## 性能优化建议

### 开启 Gzip 压缩

1Panel 默认开启 Gzip，如需调整：

1. 进入 **网站** → 选择网站 → **配置**
2. 在 Nginx 配置中确认以下内容存在：

```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
gzip_min_length 1000;
```

### 配置浏览器缓存

在 Nginx 配置中添加：

```nginx
location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2)$ {
    expires 30d;
    add_header Cache-Control "public, immutable";
}
```

### 启用 HTTP/2

如果已配置 HTTPS，可以在 1Panel 中启用 HTTP/2：
1. 进入网站配置
2. 在 HTTPS 配置中勾选 **启用 HTTP/2**

## 常见问题

**Q: 需要配置反向代理吗？**  
A: 不需要。HQ-ICON 是纯前端项目，直接托管静态文件即可。

**Q: 需要安装 Node.js 环境吗？**  
A: 不需要。构建在本地完成，服务器只需要 Web 服务器（Nginx/OpenResty）。

**Q: 可以部署到子目录吗（如 `/icon/`）？**  
A: 可以。但需要修改 `vite.config.js` 中的 `base` 配置为 `/icon/`，然后重新构建。

**Q: 支持 CDN 加速吗？**  
A: 支持。可以将 `dist` 目录上传到 CDN，或在 1Panel 前配置 CDN 回源。

## 总结

使用 1Panel 部署 HQ-ICON 非常简单：
1. ✅ 本地构建 → 上传 → 创建网站 → 完成
2. ✅ 无需配置数据库、后端服务
3. ✅ 开箱即用，适合快速部署

如有问题，可以查看 1Panel 的 Nginx 日志或联系项目维护者。
