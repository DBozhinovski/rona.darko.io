/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-unassigned-import */

// const axios = require('axios');
// const cheerio = require('cheerio');

const wikiParser = require('./scrapers/wikipedia');
const whoParser = require('./scrapers/who');

exports.onCreateNode = async ({
  node,
  loadNodeContent,
  actions: {createNode},
  createNodeId,
  createContentDigest
}) => {
  if (node.name !== 'ecdcStats') {
    return;
  } // 'todos' is the name we gave the remote node in gatsby-config.js, so we only want to transform that

  try {
    const nodeContent = await loadNodeContent(node);
    const ecdcData = JSON.parse(nodeContent.trim());

    ecdcData.records.forEach((country, idx) => {
      const childId = createNodeId(`${node.id}${idx}`);
      const countryNode = {
        ...country,
        dateReported: (() => {
          const d = new Date();
          d.setDate(country.day);
          d.setMonth(country.month - 1);
          d.setFullYear(country.year);

          return d;
        })(),
        countryId: idx,
        sourceInstanceName: node.name,
        id: childId,
        children: [],
        parent: node.id,
        internal: {
          type: 'ECDCCountry',
          contentDigest: createContentDigest(country)
        }
      };
      createNode(countryNode);
    });
  } catch (error) {
    console.error(error);
  }
};

exports.sourceNodes = async ({actions, createContentDigest}) => {
  await wikiParser(actions, createContentDigest);
  await whoParser(actions, createContentDigest);
  // const {createNode} = actions;

  // const res = await axios.get('https://en.wikipedia.org/wiki/Template:2019%E2%80%9320_coronavirus_pandemic_data');
  // const $ = cheerio.load(res.data);

  // const lookupTable = [false, 'name', 'cases', 'deaths', 'recovered', false];

  // $('#covid19-container>table').children().not('thead').children('tr').not('.sortbottom').each(function (i) {
  //   const countryData = {};

  //   $(this).children('th, td').each(function (i) {
  //     if (lookupTable[i]) {
  //       countryData[lookupTable[i]] = $(this).text();
  //     }
  //   });

  //   if (i === 0 || i === 1) {
  //     return;
  //   }

  //   const wikiCountryNode = {
  //     id: `wnode-${i}`,
  //     parent: '__SOURCE__',
  //     internal: {
  //       type: 'WikiCountry',
  //       contentDigest: createContentDigest(countryData)
  //     },
  //     children: [],
  //     ...countryData
  //   };

  //   createNode(wikiCountryNode);
  // });
}
