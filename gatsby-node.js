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
  const { createNode } = actions;

  await wikiParser(actions, createContentDigest);
  await whoParser(actions, createContentDigest);
  
  const lastScrapedAt = new Date();

  let dd = lastScrapedAt.getDate();
  let mm = lastScrapedAt.getMonth()+1; 
  const yyyy = lastScrapedAt.getFullYear();
  
  if(dd<10) 
  {
      dd=`0${dd}`;
  } 

  if(mm<10) 
  {
      mm=`0${mm}`;
  } 

  const lastScrapedAtNode = {
    date: dd,
    month: mm,
    year: yyyy,
  };

  createNode({
    id: `lastScraped`,
    parent: '__SOURCE__',
    internal: {
      type: 'LastScraped',
      contentDigest: createContentDigest(lastScrapedAtNode),
    },
    children: [],
    ...lastScrapedAtNode,
  });
}
