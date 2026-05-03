const express = require('express');
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

// ======================
// 数据库初始化
// ======================
const DB_PATH = process.env.DATABASE_URL || path.join(__dirname, 'data.sqlite');

// 如果是 Railway 环境，使用持久化卷
if (process.env.RAILWAY_VOLUME_MOUNT_PATH) {
  const volumePath = path.join(process.env.RAILWAY_VOLUME_MOUNT_PATH, 'data.sqlite');
  // 确保目录存在
  fs.mkdirSync(path.dirname(volumePath), { recursive: true });
  db = new Database(volumePath);
} else {
  db = new Database(DB_PATH);
}

// 创建表
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    uid INTEGER PRIMARY KEY AUTOINCREMENT,
    user TEXT UNIQUE NOT NULL,
    pwd TEXT NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user TEXT NOT NULL,
    uid INTEGER NOT NULL,
    msg TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE TABLE IF NOT EXISTS posts (
    postId INTEGER PRIMARY KEY AUTOINCREMENT,
    uid INTEGER NOT NULL,
    user TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    like_count INTEGER DEFAULT 0,
    time TEXT NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS likes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uid INTEGER NOT NULL,
    postId INTEGER NOT NULL,
    UNIQUE(uid, postId)
  );
  
  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    postId INTEGER NOT NULL,
    uid INTEGER NOT NULL,
    user TEXT NOT NULL,
    content TEXT NOT NULL,
    time TEXT NOT NULL
  );
`);

// ======================
// API 接口
// ======================

// 注册
app.post('/api/reg', (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd) return res.send('err');
  
  try {
    const stmt = db.prepare('INSERT INTO users (user, pwd) VALUES (?, ?)');
    stmt.run(user, pwd);
    res.send('ok');
  } catch (e) {
    if (e.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      res.send('err'); // 用户已存在
    } else {
      console.error(e);
      res.send('err');
    }
  }
});

// 登录
app.post('/api/login', (req, res) => {
  const { user, pwd } = req.body;
  const u = db.prepare('SELECT uid FROM users WHERE user = ? AND pwd = ?').get(user, pwd);
  if (u) {
    res.json({ status: 'ok', uid: u.uid });
  } else {
    res.json({ status: 'err' });
  }
});

// 发送消息
app.post('/api/send', (req, res) => {
  const { user, uid, msg } = req.body;
  db.prepare('INSERT INTO messages (user, uid, msg) VALUES (?, ?, ?)').run(user, uid, msg);
  res.send('ok');
});

// 获取消息
app.get('/api/msg', (req, res) => {
  const messages = db.prepare('SELECT * FROM messages ORDER BY id ASC').all();
  res.json(messages);
});

// 清空消息
app.get('/api/clear', (req, res) => {
  db.prepare('DELETE FROM messages').run();
  res.send('ok');
});

// 发帖
app.post('/api/createPost', (req, res) => {
  const { uid, user, title, content } = req.body;
  if (!title || !content) return res.send('err');
  
  const time = new Date().toLocaleString();
  db.prepare('INSERT INTO posts (uid, user, title, content, time) VALUES (?, ?, ?, ?, ?)')
    .run(uid, user, title, content, time);
  res.send('ok');
});

// 获取帖子
app.get('/api/posts', (req, res) => {
  const posts = db.prepare('SELECT * FROM posts ORDER BY postId DESC').all();
  res.json(posts);
});

// 点赞
app.post('/api/like', (req, res) => {
  const { uid, postId } = req.body;
  
  try {
    db.prepare('INSERT INTO likes (uid, postId) VALUES (?, ?)').run(uid, postId);
    db.prepare('UPDATE posts SET like_count = like_count + 1 WHERE postId = ?').run(postId);
    res.send('ok');
  } catch (e) {
    if (e.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      res.send('repeat'); // 已经点过赞了
    } else {
      console.error(e);
      res.send('err');
    }
  }
});

// 发表评论
app.post('/api/comment', (req, res) => {
  const { postId, uid, user, content } = req.body;
  if (!postId || !uid || !user || !content) return res.send('err');
  
  const time = new Date().toLocaleString();
  db.prepare('INSERT INTO comments (postId, uid, user, content, time) VALUES (?, ?, ?, ?, ?)')
    .run(postId, uid, user, content, time);
  res.send('ok');
});

// 获取指定帖子的评论
app.get('/api/comments/:postId', (req, res) => {
  const postId = Number(req.params.postId);
  const comments = db.prepare('SELECT * FROM comments WHERE postId = ? ORDER BY id ASC').all(postId);
  res.json(comments);
});

// ======================
// 启动服务器
// ======================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务器启动 ✅ 端口：${PORT}`);
  console.log('论坛 + 聊天室已就绪');
});
