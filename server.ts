import app from "./index.html";

const server = Bun.serve({
  port: process.env.PORT || 3000,
  routes: {
    "/*": app,
  },

  error(err) {
    throw new Error(`Error in Bun.serve: ${err.message}`);
  },
});

console.log(`server running on port ${server.port}`);
