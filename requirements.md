# AllMCP 项目需求文档

## 项目概述
AllMCP 是一个资源管理平台，提供各类技术资源的分类展示和管理功能。

## 主要功能模块

### 1. 资源展示
- 首页资源展示 (`/`)
- 分类资源页面 (`/category/[category]`)
- 全部资源列表 (`/resources`)

### 2. 管理功能
- 管理员后台 (`/admin`)
  - 受保护的权限路由
  - 使用cookie进行身份验证

### 3. SEO优化
- 自动生成sitemap.xml
- 支持动态分类路由

## 核心组件

### 页面组件
- `Layout` - 全局布局
- `Navigation` - 导航栏
- `Footer` - 页脚
- `ResourceList` - 资源卡片列表
- `SearchBar` - 搜索功能

### 功能组件
- `ArticleEditor` - 文章编辑器
- `ArticleList` - 文章列表
- `LoginModal` - 登录弹窗
- `Pagination` - 分页器
- `Toast` - 通知提示

## 数据管理

### 数据源
- 本地JSON文件存储资源数据
  - `data/json/` 目录下各类分类JSON
  - `featured.json` 精选资源

### 工具函数
- `resourceUtils.js` - 资源相关工具
- `auth.js` - 认证相关
- `utils.ts` - 通用工具

## API接口

### 前端API
- `/api` 路由下的各类API端点

### 系统配置
- 中间件保护 `/admin` 路由
- 支持Edge Runtime

## 技术栈
- Next.js 框架
- Tailwind CSS
- 文件系统路由
- 服务端组件