export default {
  async fetch(request) {
    const workerOrigin = "https://chatroom-server.ltc114514191.workers.dev";
    const url = new URL(request.url);
    const workerUrl = new URL(url.pathname + url.search, workerOrigin);
    return fetch(workerUrl, request);
  },
};
