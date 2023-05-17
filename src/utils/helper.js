const database = require('../db/database.json');

const numberToPersian = (num) => {
  const persianNumberArray = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  const numArray = num.toString().split('');

  return numArray.map(value => persianNumberArray[value]).join('');
}

const generatePoemJson = (id) => {
  return {
    id: id,
    title: `غزل شماره ${numberToPersian(id)}`,
    versecount: database[id - 1].length,
    verses: database[id - 1],
  };
};

const generateVerseJson = (poem, verseId) => {
  return {
    poemid: poem.id,
    versenumber: verseId + 1,
    verse: poem.verses[verseId],
  };
}

module.exports = {
  numberToPersian,
  generatePoemJson,
  generateVerseJson,
};
