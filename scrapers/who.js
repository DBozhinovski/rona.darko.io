const axios = require('axios');
const cheerio = require('cheerio');
const crawler = require('crawler-request');
const {NlpManager} = require('node-nlp');

const positiveExamples = [
  'China 82631 86 3321 7 Local transmission 0',
  'Papua New Guinea 1 0 0 0 Imported cases only 11',
  'New Zealand 647 47 1 0 Local transmission 0',
  'Northern Mariana Islands (Commonwealth of the) 2 0 0 0 Under investigation 3',
  'The United Kingdom 25154 3009 1789 381 Local transmission 0',
  'Austria 10182 564 128 20 Local transmission 0',
  'Liechtenstein 68 4 0 0 Under investigation 0'
];

const negativeExamples = [
  'Numbers include both domestic and repatriated case',
  'Case classifications arebased on WHO case definitionsfor COVID-19.',
  'Due to differences in reporting methods, retrospective data consolidation, and reporting delays, the number of new cases maynotalways',
  'All public health measures to stop disease spread can be balanced with adaptive strategies to encourage community ',
  'connection within families and communities. Measures for the general public include introducing flexible work',
  'Figure 1. Countries, territories or areas with reported confirmed cases of COVID-19, 1 April2020',
  '▪ Module 3: Repurposing an existing building into a SARI treatment centre ',
  'installations for SARI facilities is currently under development. ',
  'new ',
  'Transmission ',
  'Northern Mariana ',
  'the) '
];

const train = async () => {
  const manager = new NlpManager({languages: ['en'], nlu: {log: true, useNoneFeature: false}});

  positiveExamples.forEach(e => manager.addDocument('en', e, 'keep'));
  negativeExamples.forEach(e => manager.addDocument('en', e, 'filter'));

  await manager.train();
  manager.save();

  return manager;
};

const scrapeWHO = async (actions, createContentDigest) => {
  const {createNode} = actions;

  const latestRep = await axios.get('https://www.who.int/emergencies/diseases/novel-coronavirus-2019/situation-reports');
  const $ = cheerio.load(latestRep.data);

  const WHORoot = 'https://www.who.int';
  const latestReportURL = `${WHORoot}${$('#PageContent_C006_Col01 div>p>a').first().attr('href')}`;

  const pdfRes = await crawler(latestReportURL);

  const lines = pdfRes.text.split('\n').filter(n => n);

  const manager = await train();

  const statusWords = [
    'Local',
    'transmission',
    'Imported',
    'cases',
    'only',
    'investigation'
  ]

  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0; i < lines.length; i++) {
    // eslint-disable-next-line no-await-in-loop
    const res = await manager.process(lines[i]);
    if (res.intent === 'keep') {
      if (!lines[i].includes(')') && lines[i][0] !== '' && lines[i].match(/\d/)) {
        const split = lines[i].split(' ');

        const name = split.filter(w => {
          if (w && !w.match(/\d/g) && !statusWords.includes(w)) {
            return true;
          }

          return false;
        }).join(' ');
        const numbers = split.filter(w => w.match(/\d/g));

        const parsedData = {
          name,
          confirmed: numbers[0],
          confirmedNew: numbers[1],
          totalDeaths: numbers[2],
          newDeaths: numbers[3],
          daysSinceLastReport: numbers[4]
        }

        if (name && numbers.length === 5) {
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
      }
    }
  }
};

module.exports = scrapeWHO;
