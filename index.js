const axios = require("axios");
const args = process.argv;
const dotenv = require("dotenv").config();

const [, , word] = args;
let language = "en-gb";
let config = "fields=definitions&strictMatch=true";

const { API_KEY, API_ID } = process.env;

const url = `https://od-api.oxforddictionaries.com/api/v2/entries/${language}/${word}?${config}`;

const result = axios.get(url, {
  headers: { app_id: API_ID, app_key: API_KEY },
});

result
  .then((response) => {
    const {
      lexicalCategory: { text: type },
      text: word,
    } = response.data.results[0].lexicalEntries[0];

    const senses = response.data.results[0].lexicalEntries[0].entries[0].senses;

    const definitions = [];
    senses.forEach((el) => definitions.push(el.definitions.toString()));

    console.log(`${word} (${type})`);
    definitions.forEach((el, i) => console.log(`${i + 1}. ${el}`));
  })
  .catch(() => {
    console.log("failed");
  });

