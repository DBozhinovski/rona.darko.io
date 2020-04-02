/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-unassigned-import */

const axios = require('axios');
const cheerio = require('cheerio');

const scrapeWikipedia = async (actions, createContentDigest) => {
  const {createNode} = actions;

  const res = await axios.get('https://en.wikipedia.org/wiki/Template:2019%E2%80%9320_coronavirus_pandemic_data');
  const $ = cheerio.load(res.data);

  const lookupTable = [false, 'name', 'cases', 'deaths', 'recovered', false];

  $('#covid19-container>table').children().not('thead').children('tr').not('.sortbottom').each(function (i) {
    const countryData = {};

    $(this).children('th, td').each(function (i) {
      if (lookupTable[i]) {
        countryData[lookupTable[i]] = $(this).text().replace(/(\[.*\])?\\n/g, '');

        if (lookupTable[i] !== 'name') {
          countryData[lookupTable[i]] = parseInt(countryData[lookupTable[i]].replace(',', ''), 10);
        }
      }
    });

    if (i === 0 || i === 1) {
      return;
    }

    const wikiCountryNode = {
      id: `wnode-${i}`,
      parent: '__SOURCE__',
      internal: {
        type: 'WikiCountry',
        contentDigest: createContentDigest(countryData)
      },
      children: [],
      ...countryData
    };

    createNode(wikiCountryNode);
  });
};

module.exports = scrapeWikipedia;
