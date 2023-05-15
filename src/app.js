const { Hono } = require('hono');

const app = new Hono();

app.get('/', (c) => {
  return c.json({'ok': true});
});

export default app;
