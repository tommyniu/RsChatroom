export default {
  async fetch(request, env, ctx) {
    const workerUrl = "https://chatroom-server.ltc114514191.workers.dev";
    return fetch(workerUrl + new URL(request.url).pathname + new URL(request.url).search, request);
  },
};
