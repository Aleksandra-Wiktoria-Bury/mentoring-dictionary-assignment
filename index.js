const axios = require("axios");
const dotenv = require("dotenv").config();

const express = require("express");
const app = express();

let language = "en-gb";
let config = "fields=definitions&strictMatch=true";

const { API_KEY, API_ID } = process.env;

app.get("/find/:word", (req, res) => {
  const { word } = req.params;
  const url = `https://od-api.oxforddictionaries.com/api/v2/entries/${language}/${word}?${config}`;

  axios
    .get(url, {
      headers: { app_id: API_ID, app_key: API_KEY },
    })
    .then((response) => {
      const {
        lexicalCategory: { text: type },
        text: word,
      } = response.data.results[0].lexicalEntries[0];
      const senses =
        response.data.results[0].lexicalEntries[0].entries[0].senses;

      const definitions = [];
      senses.forEach((el) => definitions.push(el.definitions.toString()));

      res
        .status(200)
        .json({ searched: `${word} (${type})`, definitions: definitions, providedBy: 'Oxford University Press' });
    })
    .catch(() => {
      res.json("Failed to find the word.");
    });
});

app.listen(3000, () => {
  console.log(`Server is Listening on 3000`);
});
