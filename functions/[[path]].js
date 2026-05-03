export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname;

  // 注册接口
  if (path === "/api/reg" && request.method === "POST") {
    try {
      const { user, pwd } = await request.json();
      if (!user || !pwd) return new Response("err");

      await env.DB.prepare(`INSERT INTO users (user, pwd) VALUES (?, ?)`).bind(user, pwd).run();
      return new Response("ok");
    } catch (e) {
      return new Response("err");
    }
  }

  // 登录接口
  if (path === "/api/login" && request.method === "POST") {
    const { user, pwd } = await request.json();
    const u = await env.DB.prepare(`SELECT uid FROM users WHERE user = ? AND pwd = ?`).bind(user, pwd).first();

    if (u) {
      return Response.json({ status: "ok", uid: u.uid });
    } else {
      return Response.json({ status: "err" });
    }
  }

  // 发送消息
  if (path === "/api/send" && request.method === "POST") {
    const { user, uid, msg } = await request.json();
    await env.DB.prepare(`INSERT INTO messages (user, uid, msg) VALUES (?, ?, ?)`).bind(user, uid, msg).run();
    return new Response("ok");
  }

  // 获取消息
  if (path === "/api/msg") {
    const messages = await env.DB.prepare(`SELECT * FROM messages ORDER BY id ASC`).all();
    return Response.json(messages.results);
  }

  // 其他请求返回前端页面
  return fetch(request);
}