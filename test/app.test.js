const expect = require('chai').expect;

const { numberToPersian, generatePoemJson, generateVerseJson } = require('../src/utils/helper');

describe('Test helper functions', () => {
  const poem = {
    id: 1,
    title: 'غزل شماره ۱',
    versecount: 7,
    verses: [['اَلا یا اَیُّهَا السّاقی اَدِرْ کَأسَاً و ناوِلْها','که عشق آسان نمود اوّل ولی افتاد مشکل‌ها'],['به بویِ نافه‌ای کآخر صبا زان طُرّه بگشاید','ز تابِ جَعدِ مشکینش چه خون افتاد در دل‌ها'],['مرا در منزلِ جانان چه امنِ عیش چون هر دَم','جَرَس فریاد می‌دارد که بَربندید مَحمِل‌ها'],['به مِی سجّاده رنگین کن گَرت پیرِ مُغان گوید','که سالِک بی‌خبر نَبوَد ز راه و رسمِ منزل‌ها'],['شبِ تاریک و بیمِ موج و گردابی چنین هایل','کجا دانند حالِ ما سبکبارانِ ساحل‌ها'],['همه کارم ز خودکامی به بدنامی کشید آخر','نهان کِی مانَد آن رازی کزو سازند محفل‌ها'],['حضوری گر همی‌خواهی از او غایب مشو حافظ','مَتٰی ما تَلْقَ مَنْ تَهْویٰ دَعِ الدُّنْیا و اَهْمِلْها']],
  };

  const verse = {
    poemid: 1,
    versenumber: 1,
    verse: poem.verses[0],
  }

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
});
