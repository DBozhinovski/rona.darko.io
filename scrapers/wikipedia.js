/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-unassigned-import */
const axios = require('axios');
const fs = require('fs');
const jsdom = require('jsdom');

const { JSDOM } = jsdom;

const scrapeWikipedia = async (actions, createContentDigest) => {
  const {createNode} = actions;
  const outFile = {};

  const res = await axios.get('https://en.wikipedia.org/wiki/Template:2019%E2%80%9320_coronavirus_pandemic_data');
  const dom = new JSDOM(res.data, { runScripts: "dangerously" });
  const tbodyTr = Array.from(dom.window.document.body.querySelectorAll('#thetable tbody tr:not(.sortbottom)'));
  
  const table = [false, 'name', 'cases', 'deaths', 'recovered', false];
  const totalTable = [false, 'cases', 'deaths', 'recovered', false];
  
  tbodyTr.forEach((tr, i) => {
    const cData = {};
    if (i === 0) return;
    
    if (i === 1) {
      Array.from(tr.children).filter(c => c.textContent).forEach((c, i) => {
        if (totalTable[i]) {
          cData[totalTable[i]] = parseInt(c.textContent.replace(/\D/g,''), 10) || 0;
        }
      });

      const wikiTotalNode = {
        id: `wnode-total`,
        parent: '__SOURCE__',
        internal: {
          type: 'WikiCountryTotal',
          contentDigest: createContentDigest(cData),
        },
        children: [],
        ...cData,
      };
    
      outFile.total = cData;
      createNode(wikiTotalNode);

      return;
    }
    
    Array.from(tr.children).forEach((c, i) => {
      if (table[i]) {
        cData[table[i]] = c.textContent.replace(/\[.*\]|\(.*\)|\n|,/g, '').trim();
        if (table[i] !== 'name') {
          cData[table[i]] = parseInt(cData[table[i]].replace(/\D/g, ''), 10) || 0;
        }
      }
    });

    const wikiCountryNode = {
      id: `wnode-${i}`,
      parent: '__SOURCE__',
      internal: {
        type: 'WikiCountry',
        contentDigest: createContentDigest(cData),
      },
      children: [],
      ...cData
    };

    outFile[cData.name] = cData;

    createNode(wikiCountryNode);
  });

  fs.writeFile('public/wikipedia.json', JSON.stringify(outFile), (err) => {
    if (err) console.err(err);
  });
};

module.exports = scrapeWikipedia;
