# 聊天室 + 论坛服务器 🦞

基于 **Cloudflare Workers + D1** 的实时聊天室和论坛系统。

## ✨ 特性

- ✅ 用户注册/登录
- ✅ 实时聊天室（2 秒轮询刷新）
- ✅ 论坛发帖/点赞
- ✅ 评论功能
- ✅ 数据持久化（Cloudflare D1）
- ✅ 管理员功能（UID=1 可清空消息）
- ✅ 美观的深色 UI 设计
- ✅ **全球 CDN 加速**
- ✅ **完全免费**

## 🚀 快速部署

**详细步骤请查看**: [`DEPLOY_GUIDE.md`](./DEPLOY_GUIDE.md)

### 3 分钟部署流程：

1. **上传代码到 GitHub**（网页拖拽上传）
2. **创建 D1 数据库**（Cloudflare 控制台点几下）
3. **部署 Pages**（连接 GitHub，自动构建）

搞定！全球可访问！

## 🛠️ 本地开发

```bash
# 安装依赖
npm install

# 本地开发（需要 Wrangler）
npm run dev

# 访问 http://localhost:8787
```

## 📁 项目结构

```
├── src/
│   └── worker.js       # 主服务器代码（Hono 框架）
├── package.json        # 依赖配置
├── wrangler.toml       # Cloudflare 配置
├── schema.sql          # 数据库架构
├── DEPLOY_GUIDE.md     # 详细部署指南
└── README.md           # 本文件
```

## 🌐 技术栈

- **运行时**: Cloudflare Workers
- **框架**: Hono（轻量级 Web 框架）
- **数据库**: Cloudflare D1（SQLite）
- **前端**: 原生 HTML/CSS/JavaScript
- **部署**: Cloudflare Pages
- **CDN**: Cloudflare 全球网络

## 💰 成本

**完全免费！**

- Cloudflare Workers: 免费 100,000 请求/天
- Cloudflare D1: 免费 5GB 存储 + 100 万行读取/月
- Cloudflare Pages: 免费无限构建

## 📖 API 接口

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/reg` | POST | 用户注册 |
| `/api/login` | POST | 用户登录 |
| `/api/send` | POST | 发送消息 |
| `/api/msg` | GET | 获取消息 |
| `/api/clear` | GET | 清空消息（管理员） |
| `/api/createPost` | POST | 发帖 |
| `/api/posts` | GET | 获取帖子 |
| `/api/like` | POST | 点赞 |
| `/api/comment` | POST | 评论 |
| `/api/comments/:postId` | GET | 获取帖子评论 |

## 🤝 贡献

有问题或建议？欢迎提 Issue 或 PR！

## 📄 License

ISC

---

**由 爪子 🦞 帮你部署**
