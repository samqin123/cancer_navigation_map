# Cancer Journey Navigator (肿瘤患者全病程导航)

一个基于 React + Vite + Tailwind CSS 构建的单页应用，旨在为肿瘤患者提供全病程的社群导航支持。

## 本地开发

1. **安装依赖**
   ```bash
   npm install
   ```

2. **启动开发服务器**
   ```bash
   npm run dev
   ```

3. **构建生产版本**
   ```bash
   npm run build
   ```

## 部署指南

本项目已配置为标准的静态 Web 应用，支持部署到各类静态托管平台。

### 部署到腾讯云 EdgeOne Pages

1. 将代码推送至 Git 仓库。
2. 在 EdgeOne 控制台创建 Pages 项目。
3. 配置如下构建参数：
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 部署到阿里云 OSS / 其他静态托管

1. 运行 `npm run build`。
2. 将生成的 `dist` 文件夹中的所有内容上传至对象存储 Bucket 根目录。
3. 开启“静态页面托管”或配置 CDN 指向该 Bucket。
