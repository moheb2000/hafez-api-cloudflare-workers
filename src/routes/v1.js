const { Hono } = require('hono/tiny');
const database = require('../db/database.json');
const { generatePoemJson, generateVerseJson } = require('../utils/helper');
const packageJson = require('../../package.json');

const v1 = new Hono();

v1.get('/', (c) => {
  const versionList = packageJson.version.split('.').map(Number);
  return c.json({
    version: {
      major: versionList[0],
      minor: versionList[1],
      micro: versionList[2],
    },
    poemcount: database.length,
  });
});

v1.get('/poems', (c) => {
  const limitRaw = parseInt(c.req.query('limit'));
  const limit = limitRaw > 0 && limitRaw < 10 ? limitRaw : 10;
  const startRaw = parseInt(c.req.query('start'));
  const start = startRaw > 1 ? startRaw : 1;
  const end = start + limit - 1 < database.length ? start + limit - 1 : database.length;

  if (start > database.length) {
    return c.json({
      error: 'Bad request',
    }, 400);
  }

  let poems = [];
  for (let i = start; i <= end; i++) {
    poems.push(generatePoemJson(i));
  }

  return c.json({
    limit: limit,
    start: start,
    end: end,
    poems: poems,
  });
});

v1.get('/poems/random', (c) => {
  const randomId = Math.floor(Math.random() * database.length) + 1;
  return c.json(generatePoemJson(randomId));
});

v1.get('/poems/:id', (c) => {
  const id = parseInt(c.req.param('id'));

  if (isNaN(id)) {
    return c.json({
      error: 'Bad request',
    }, 400);
  }

  if (id <= 0 || id > database.length) {
    return c.json({
      error: 'Not found',
    }, 404);
  }

  return c.json(generatePoemJson(id));
});

v1.get('/poems/verse/random', (c) => {
  const randomId = Math.floor(Math.random() * database.length) + 1;
  const poem = generatePoemJson(randomId);
  const randomVerseId = Math.floor(Math.random() * poem.versecount);

  return c.json(generateVerseJson(poem, randomVerseId));
});

v1.get('/poems/:id/verse/random', (c) => {
  const id = parseInt(c.req.param('id'));

  if (isNaN(id)) {
    return c.json({
      error: 'Bad request',
    }, 400);
  }

  if (id <= 0 || id > database.length) {
    return c.json({
      error: 'Not found',
    }, 404);
  }

  const poem = generatePoemJson(id);
  const randomVerseId = Math.floor(Math.random() * poem.versecount);

  return c.json(generateVerseJson(poem, randomVerseId));
});

v1.get('/poems/:id/verse/:versenumber', (c) => {
  const id = parseInt(c.req.param('id'));

  if (isNaN(id)) {
    return c.json({
      error: 'Bad request',
    }, 400);
  }

  if (id <= 0 || id > database.length) {
    return c.json({
      error: 'Not found',
    }, 404);
  }

  const versenumber = parseInt(c.req.param('versenumber'));

  const poem = generatePoemJson(id);

  if (isNaN(versenumber)) {
    return c.json({
      error: 'Bad request',
    }, 400);
  }

  if (versenumber <= 0 || versenumber > poem.versecount) {
    return c.json({
      error: 'Not found',
    }, 404);
  }
  
  return c.json(generateVerseJson(poem, versenumber - 1));
});

module.exports = v1;
