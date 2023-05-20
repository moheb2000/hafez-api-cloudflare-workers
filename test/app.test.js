const expect = require('chai').expect;

const { numberToPersian, generatePoemJson, generateVerseJson } = require('../src/utils/helper');
const packageJson = require('../package.json');
const database = require('../src/db/database.json')
const { unstable_dev } = require("wrangler");

const poem = {
  id: 1,
  title: 'غزل شماره ۱',
  versecount: 7,
  verses: database[0],
};

const verse = {
  poemid: 1,
  versenumber: 1,
  verse: poem.verses[0],
}

describe('Test helper functions', () => {
  describe('numberToPersian', () => {
    it('returns a string', () => {
      expect(numberToPersian(123)).to.be.a('string');
    });
    it('returns ۱۲۳ for 123', () => {
      expect(numberToPersian(123)).to.equal('۱۲۳');
    });
  });

  describe('generatePoemJson', () => {
    it('returns an object', () => {
      expect(generatePoemJson(1)).to.be.an('object');
    });
    it('returns correct json for peom with id 1', () => {
      expect(generatePoemJson(1)).to.deep.equal(poem);
    });
  });

  describe('generateVerseJson', () => {
    it('returns an object', () => {
      expect(generateVerseJson(poem, 0)).to.be.an('object');
    });
    it('returns correct json for 1st verse of peom with id 1', () => {
      expect(generateVerseJson(poem, 0)).to.deep.equal(verse);
    });
  });
});

describe('Test API calls', () => {
  let worker;

  describe('GET /', () => {
    before(async () => {
      return worker = await unstable_dev("src/app.js", {
        experimental: { disableExperimentalWarning: true },
      });
    });

    after(async () => {
      return await worker.stop();
    });

    it('returns an object', async () => {
      const resp = await worker.fetch();
      if (resp) {
        const json = await resp.json();
        expect(json).to.be.an('object');
      }
    });

    it('returns with status code 200', async () => {
      const resp = await worker.fetch();
      if (resp) {
        expect(resp.status).to.equal(200);
      }
    });

    it('returns welcome message', async () => {
      const resp = await worker.fetch();
      if (resp) {
        const json = await resp.json();
        expect(json.message).to.equal('Welcome to Hafez API');
      }
    });
  });

  describe('GET /v1', () => {
    before(async () => {
      return worker = await unstable_dev("src/app.js", {
        experimental: { disableExperimentalWarning: true },
      });
    });

    after(async () => {
      return await worker.stop();
    });

    it('returns an object', async () => {
      const resp = await worker.fetch('/v1');
      if (resp) {
        const json = await resp.json();
        expect(json).to.be.an('object');
      }
    });

    it('returns with status code 200', async () => {
      const resp = await worker.fetch('/v1');
      if (resp) {
        expect(resp.status).to.equal(200);
      }
    });

    it('returns correct versions', async () => {
      const resp = await worker.fetch('/v1');
      if (resp) {
        const json = await resp.json();
        const versionList = packageJson.version.split('.');
        expect(json.version).to.deep.equal({
          major: parseInt(versionList[0]),
          minor: parseInt(versionList[1]),
          micro: parseInt(versionList[2]),
        });
      }
    });

    it('returns currect poem count', async () => {
      const resp = await worker.fetch('/v1');
      if (resp) {
        const json = await resp.json();
        expect(json.poemcount).to.equal(database.length);
      }
    });
  });

  describe('GET /v1/poems', () => {
    before(async () => {
      return worker = await unstable_dev("src/app.js", {
        experimental: { disableExperimentalWarning: true },
      });
    });

    after(async () => {
      return await worker.stop();
    });

    it('returns an object', async () => {
      const resp = await worker.fetch('/v1/poems');
      if (resp) {
        const json = await resp.json();
        expect(json).to.be.an('object');
      }
    });

    it('returns with status code 200', async () => {
      const resp = await worker.fetch('/v1/poems');
      if (resp) {
        expect(resp.status).to.equal(200);
      }
    });

    it('returns correct response', async () => {
      const resp = await worker.fetch('/v1/poems');
      if (resp) {
        const json = await resp.json();
        expect(json.limit).to.equal(10);
        expect(json.start).to.equal(1);
        expect(json.end).to.equal(10);
        expect(json.poems.length).to.equal(10);
        expect(json.poems[0]).to.deep.equal(poem);
        expect(json.poems[9].verses).to.deep.equal(database[9]);
      }
    });

    it('returns limit 5 when set limit parameter to 5', async () => {
      const resp = await worker.fetch('/v1/poems?limit=5');
      if (resp) {
        const json = await resp.json();
        expect(json.limit).to.equal(5);
      }
    });

    it('returns start 5 when set start parameter to 5', async () => {
      const resp = await worker.fetch('/v1/poems?start=5');
      if (resp) {
        const json = await resp.json();
        expect(json.start).to.equal(5);
      }
    });

    it('returns limit 10 for invalid query parameter limit', async () => {
      const resp1 = await worker.fetch('/v1/poems?limit=15');
      if (resp1) {
        const json = await resp1.json();
        expect(json.limit).to.equal(10);
      }

      const resp2 = await worker.fetch('/v1/poems?limit=0');
      if (resp2) {
        const json = await resp2.json();
        expect(json.limit).to.equal(10);
      }

      const resp3 = await worker.fetch('/v1/poems?limit=-1');
      if (resp3) {
        const json = await resp3.json();
        expect(json.limit).to.equal(10);
      }

      const resp4 = await worker.fetch('/v1/poems?limit=abc');
      if (resp4) {
        const json = await resp4.json();
        expect(json.limit).to.equal(10);
      }
    });

    it('returns start 1 for out of range ids', async () => {
      const resp1 = await worker.fetch('/v1/poems?start=0');
      if (resp1) {
        const json = await resp1.json();
        expect(json.start).to.equal(1);
      }

      const resp2 = await worker.fetch('/v1/poems?start=-1');
      if (resp2) {
        const json = await resp2.json();
        expect(json.start).to.equal(1);
      }

      const resp3 = await worker.fetch('/v1/poems?start=abc');
      if (resp3) {
        const json = await resp3.json();
        expect(json.start).to.equal(1);
      }
    });

    it('returns bad request for start ids more than last ghazal', async () => {
      const resp1 = await worker.fetch(`/v1/poems?start=${database.length}`);
      if (resp1) {
        expect(resp1.status).to.equal(200);
      }

      const resp2 = await worker.fetch(`/v1/poems?start=${database.length + 1}`);
      if (resp2) {
        const json = await resp2.json();
        expect(resp2.status).to.equal(400);
        expect(json.error).to.equal('Bad request');
      }
    });
  });

  describe('GET /v1/poems/random', () => {
    before(async () => {
      return worker = await unstable_dev("src/app.js", {
        experimental: { disableExperimentalWarning: true },
      });
    });

    after(async () => {
      return await worker.stop();
    });

    it('returns an object', async () => {
      const resp = await worker.fetch('/v1/poems/random');
      if (resp) {
        const json = await resp.json();
        expect(json).to.be.an('object');
      }
    });

    it('returns with status code 200', async () => {
      const resp = await worker.fetch('/v1/poems/random');
      if (resp) {
        expect(resp.status).to.equal(200);
      }
    });
  });

  describe('GET /v1/poems/:id', () => {
    before(async () => {
      return worker = await unstable_dev("src/app.js", {
        experimental: { disableExperimentalWarning: true },
      });
    });

    after(async () => {
      return await worker.stop();
    });

    it('returns an object', async () => {
      const resp = await worker.fetch('/v1/poems/1');
      if (resp) {
        const json = await resp.json();
        expect(json).to.be.an('object');
      }
    });

    it('returns with status code 200', async () => {
      const resp = await worker.fetch('/v1/poems/1');
      if (resp) {
        expect(resp.status).to.equal(200);
      }
    });

    it('returns correct response', async () => {
      const resp1 = await worker.fetch('/v1/poems/1');
      if (resp1) {
        const json = await resp1.json();
        expect(json).to.deep.equal(poem);
      }

      const resp2 = await worker.fetch(`/v1/poems/${database.length}`);
      if (resp2) {
        expect(resp2.status).to.equal(200);
      }
    });

    it('returns not found for out of range ids', async () => {
      const resp1 = await worker.fetch('/v1/poems/0');
      if (resp1) {
        const json = await resp1.json();
        expect(resp1.status).to.equal(404);
        expect(json.error).to.equal('Not found');
      }

      const resp2 = await worker.fetch('/v1/poems/-1');
      if (resp2) {
        const json = await resp2.json();
        expect(resp2.status).to.equal(404);
        expect(json.error).to.equal('Not found');
      }

      const resp3 = await worker.fetch(`/v1/poems/${database.length + 1}`);
      if (resp3) {
        const json = await resp3.json();
        expect(resp3.status).to.equal(404);
        expect(json.error).to.equal('Not found');
      }
    });

    it('returns bad request for invalid ids', async () => {
      const resp = await worker.fetch('/v1/poems/abc');
      if (resp) {
        const json = await resp.json();
        expect(resp.status).to.equal(400);
        expect(json.error).to.equal('Bad request');
      }
    });
  });

  describe('GET /v1/poems/verse/random', () => {
    before(async () => {
      return worker = await unstable_dev("src/app.js", {
        experimental: { disableExperimentalWarning: true },
      });
    });

    after(async () => {
      return await worker.stop();
    });

    it('returns an object', async () => {
      const resp = await worker.fetch('/v1/poems/verse/random');
      if (resp) {
        const json = await resp.json();
        expect(json).to.be.an('object');
      }
    });

    it('returns with status code 200', async () => {
      const resp = await worker.fetch('/v1/poems/verse/random');
      if (resp) {
        expect(resp.status).to.equal(200);
      }
    });
  });

  describe('GET /v1/poems/:id/verse/random', () => {
    before(async () => {
      return worker = await unstable_dev("src/app.js", {
        experimental: { disableExperimentalWarning: true },
      });
    });

    after(async () => {
      return await worker.stop();
    });

    it('returns an object', async () => {
      const resp = await worker.fetch('/v1/poems/1/verse/random');
      if (resp) {
        const json = await resp.json();
        expect(json).to.be.an('object');
      }
    });

    it('returns with status code 200', async () => {
      const resp = await worker.fetch('/v1/poems/1/verse/random');
      if (resp) {
        expect(resp.status).to.equal(200);
      }
    });

    it('returns not found for out of range ids', async () => {
      const resp1 = await worker.fetch('/v1/poems/0/verse/random');
      if (resp1) {
        const json = await resp1.json();
        expect(resp1.status).to.equal(404);
        expect(json.error).to.equal('Not found');
      }

      const resp2 = await worker.fetch('/v1/poems/-1/verse/random');
      if (resp2) {
        const json = await resp2.json();
        expect(resp2.status).to.equal(404);
        expect(json.error).to.equal('Not found');
      }

      const resp3 = await worker.fetch(`/v1/poems/${database.length + 1}/verse/random`);
      if (resp3) {
        const json = await resp3.json();
        expect(resp3.status).to.equal(404);
        expect(json.error).to.equal('Not found');
      }
    });

    it('returns bad request for invalid ids', async () => {
      const resp = await worker.fetch('/v1/poems/abc/verse/random');
      if (resp) {
        const json = await resp.json();
        expect(resp.status).to.equal(400);
        expect(json.error).to.equal('Bad request');
      }
    });
  });

  describe('GET /v1/poems/:id/verse/:versenumber', () => {
    before(async () => {
      return worker = await unstable_dev("src/app.js", {
        experimental: { disableExperimentalWarning: true },
      });
    });

    after(async () => {
      return await worker.stop();
    });

    it('returns an object', async () => {
      const resp = await worker.fetch('/v1/poems/1/verse/1');
      if (resp) {
        const json = await resp.json();
        expect(json).to.be.an('object');
      }
    });

    it('returns with status code 200', async () => {
      const resp = await worker.fetch('/v1/poems/1/verse/1');
      if (resp) {
        expect(resp.status).to.equal(200);
      }
    });

    it('returns not found for out of range ids', async () => {
      const resp1 = await worker.fetch('/v1/poems/0/verse/1');
      if (resp1) {
        const json = await resp1.json();
        expect(resp1.status).to.equal(404);
        expect(json.error).to.equal('Not found');
      }

      const resp2 = await worker.fetch('/v1/poems/-1/verse/1');
      if (resp2) {
        const json = await resp2.json();
        expect(resp2.status).to.equal(404);
        expect(json.error).to.equal('Not found');
      }

      const resp3 = await worker.fetch(`/v1/poems/${database.length + 1}/verse/1`);
      if (resp3) {
        const json = await resp3.json();
        expect(resp3.status).to.equal(404);
        expect(json.error).to.equal('Not found');
      }
    });

    it('returns bad request for invalid ids', async () => {
      const resp = await worker.fetch('/v1/poems/abc/verse/1');
      if (resp) {
        const json = await resp.json();
        expect(resp.status).to.equal(400);
        expect(json.error).to.equal('Bad request');
      }
    });

    it('returns not found for out of range versenumbers', async () => {
      const resp1 = await worker.fetch('/v1/poems/1/verse/0');
      if (resp1) {
        const json = await resp1.json();
        expect(resp1.status).to.equal(404);
        expect(json.error).to.equal('Not found');
      }

      const resp2 = await worker.fetch('/v1/poems/1/verse/-1');
      if (resp2) {
        const json = await resp2.json();
        expect(resp2.status).to.equal(404);
        expect(json.error).to.equal('Not found');
      }

      const resp3 = await worker.fetch(`/v1/poems/1/verse/${database[0].length + 1}`);
      if (resp3) {
        const json = await resp3.json();
        expect(resp3.status).to.equal(404);
        expect(json.error).to.equal('Not found');
      }
    });

    it('returns bad request for invalid ids', async () => {
      const resp = await worker.fetch('/v1/poems/1/verse/abc');
      if (resp) {
        const json = await resp.json();
        expect(resp.status).to.equal(400);
        expect(json.error).to.equal('Bad request');
      }
    });
  });
});
