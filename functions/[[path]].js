export async function onRequest({ request, env }) {
  try {
    const url = new URL(request.url);
    const path = url.pathname;

    // 登录
    if (path === "/api/login" && request.method === "POST") {
      const { user, pwd } = await request.json();
      const row = await env.DB.prepare("SELECT uid FROM users WHERE user = ? AND pwd = ?").bind(user, pwd).first();
      return new Response(JSON.stringify(row ? { status: "ok", uid: row.uid } : { status: "err" }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // 注册
    if (path === "/api/reg" && request.method === "POST") {
      const { user, pwd } = await request.json();
      await env.DB.prepare("INSERT INTO users (user, pwd) VALUES (?, ?)").bind(user, pwd).run();
      return new Response("ok");
    }

    // 发消息
    if (path === "/api/send" && request.method === "POST") {
      const { user, uid, msg } = await request.json();
      await env.DB.prepare("INSERT INTO messages (user, uid, msg) VALUES (?, ?, ?)").bind(user, uid, msg).run();
      return new Response("ok");
    }

    // 获取消息
    if (path === "/api/msg") {
      const { results } = await env.DB.prepare("SELECT * FROM messages ORDER BY id ASC").all();
      return new Response(JSON.stringify(results), { headers: { "Content-Type": "application/json" } });
    }

    // 清空消息
    if (path === "/api/clear") {
      await env.DB.prepare("DELETE FROM messages").run();
      return new Response("ok");
    }
  } catch (e) {
    return new Response("err", { status: 500 });
  }

  return fetch(request);
}
