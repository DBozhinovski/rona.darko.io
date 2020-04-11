const axios = require('axios');
const cheerio = require('cheerio');
const crawler = require('crawler-request');
const fs = require('fs');

const scrapeWHO = async (actions, createContentDigest) => {
  const {createNode} = actions;
  const outFile = {};

  const latestRep = await axios.get('https://www.who.int/emergencies/diseases/novel-coronavirus-2019/situation-reports');
  const $ = cheerio.load(latestRep.data);

  const WHORoot = 'https://www.who.int';
  const latestReportURL = `${WHORoot}${$('#PageContent_C006_Col01 div>p a').first().attr('href')}`;

  const latestReportDateText = latestReportURL.split('situation-reports/')[1].split('-')[0];
  // console.log(latestReportDate);
  const latestReportDate = new Date();
  latestReportDate.setDate(parseInt(latestReportDateText.slice(6, 8), 10));
  latestReportDate.setMonth(parseInt(latestReportDateText.slice(4, 6), 10) - 1);
  latestReportDate.setFullYear(parseInt(latestReportDateText.slice(0, 4), 10));

  const pdfRes = await crawler(latestReportURL);

  const tableSplitUp = pdfRes.text.split('Table 1.');
  const tableSplitDown = tableSplitUp[1].split('Numbers include both domestic and repatriated cases');

  const headerSplit = tableSplitDown[0].split('reported case');

  const lines = headerSplit[1].replace(/\s+Community\s+Transmission\s+/g, ' Community Transmission ').split(/\d+ \n/g);
  const last = lines.length - 1;

  lines.forEach((l, i) => {
    const newLinesRemoved = l.replace(/\n/g, '');
    const tNamesRemoved = newLinesRemoved.replace(/European Region|Western Pacific Region|Territories\*\*|South-East Asia Region|Eastern Mediterranean Region|Region of the Americas|African Region/g, '').trim();
    const specCharsRemoved = tNamesRemoved.replace(/\[.*\]/g, '');

    const name = specCharsRemoved.split(/ \d/)[0];
    const [confirmed, confirmedNew, totalDeaths, newDeaths] = specCharsRemoved.split(' ').filter(w => w.match(/\d/g)); 

    const parsedData = {
      name,
      confirmed,
      confirmedNew,
      totalDeaths,
      newDeaths,
      latestReportDate,
    };

    if (i === last) {
      outFile.total = {
        confirmed,
        confirmedNew,
        totalDeaths,
        newDeaths,
      }

      const WHOTotalNode = {
        id: `WHO-total`,
        parent: '__SOURCE__',
        internal: {
          type: 'WHOTotal',
          contentDigest: createContentDigest(parsedData),
        },
        children: [],
        confirmed,
        confirmedNew,
        totalDeaths,
        newDeaths,
        latestReportDate,
      };

      createNode(WHOTotalNode);
    } else {
      outFile[name] = {
        confirmed,
        confirmedNew,
        totalDeaths,
        newDeaths,
      };

      const WHOCountryNode = {
        id: `WHO-${i}`,
        parent: '__SOURCE__',
        internal: {
          type: 'WHOCountry',
          contentDigest: createContentDigest(parsedData)
        },
        children: [],
        ...parsedData
      };
      
      createNode(WHOCountryNode);
    }
  });

  fs.writeFile('public/who.json', JSON.stringify(outFile), (err) => {
    if (err) console.err(err);
  });
};

module.exports = scrapeWHO;
