import app from "./index.html.js";

const server = Bun.serve({
  port: process.env.PORT || 3000,
  routes: {
    "/": new Response(await app(), {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    }),

    "/:lang": async (req) =>
      new Response(await app(req.params.lang), {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      }),
    "/index.html": new Response(await app(), {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    }),

    "/gloabal.css": async () => {
      console.log("Serving ./gloabal.css");
      return new Response(Bun.file("./gloabal.css"), {
        headers: { "Content-Type": "text/css" },
      });
    },

    "/script.js": async () => {
      console.log("Serving ./script.js");
      return new Response(Bun.file("./script.js"), {
        headers: { "Content-Type": "application/javascript" },
      });
    },

    "/components/glitched-question.js": async () => {
      console.log("Serving ./components/glitched-question.js");
      return new Response(Bun.file("./components/glitched-question.js"), {
        headers: { "Content-Type": "application/javascript" },
      });
    },

    "/components/animated-text.js": async () => {
      console.log("Serving ./components/animated-text.js");
      return new Response(Bun.file("./components/animated-text.js"), {
        headers: { "Content-Type": "application/javascript" },
      });
    },

    "/components/interactive-footer.js": async () => {
      console.log("Serving ./components/interactive-footer.js");
      return new Response(Bun.file("./components/interactive-footer.js"), {
        headers: { "Content-Type": "application/javascript" },
      });
    },

    "/favicon.ico": async () => {
      console.log("Serving ./favicon/favicon.ico");
      try {
        return new Response(Bun.file("./favicon/favicon.ico"), {
          headers: { "Content-Type": "image/x-icon" },
        });
      } catch {
        return new Response(null, { status: 204 });
      }
    },

    "/favicon-96x96.png": async () => {
      console.log("Serving ./favicon/favicon-96x96.png");
      try {
        return new Response(Bun.file("./favicon/favicon-96x96.png"), {
          headers: { "Content-Type": "image/png" },
        });
      } catch {
        return new Response(null, { status: 204 });
      }
    },

    "/favicon.svg": async () => {
      console.log("Serving ./favicon/favicon.svg");
      try {
        return new Response(Bun.file("./favicon/favicon.svg"), {
          headers: { "Content-Type": "image/svg+xml" },
        });
      } catch {
        return new Response(null, { status: 204 });
      }
    },

    "/apple-touch-icon.png": async () => {
      console.log("Serving ./favicon/apple-touch-icon.png");
      try {
        return new Response(Bun.file("./favicon/apple-touch-icon.png"), {
          headers: { "Content-Type": "image/png" },
        });
      } catch {
        return new Response(null, { status: 204 });
      }
    },

    "/site.webmanifest": async () => {
      console.log("Serving ./favicon/site.webmanifest");
      try {
        return new Response(Bun.file("./favicon/site.webmanifest"), {
          headers: { "Content-Type": "application/manifest+json" },
        });
      } catch {
        return new Response(null, { status: 204 });
      }
    },

    "/.well-known/*": () => {
      console.log("Requested well-known path");
      return new Response(null, { status: 204 });
    },
  },

  error(err) {
    console.error("Server error:", err);
    return new Response("Internal Server Error", { status: 500 });
  },
});

console.log(`server running on http://localhost:${server.port}`);

console.log("grosse pute2");
