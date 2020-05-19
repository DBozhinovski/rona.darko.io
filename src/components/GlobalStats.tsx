import React from 'react';

import DataTable from './DataTable';

interface GlobalStatsProp {
  wikiTotal: {
    cases: number;
    recovered: number;
    deaths: number;
  };
  ecdcTotal: {
    total: {
      cases: number;
      deaths: number;
    }
  };
  // whoTotal: {
  //   confirmed: number;
  //   totalDeaths: number;
  // };
}

export const GlobalStats = ({ wikiTotal, ecdcTotal, whoTotal }: GlobalStatsProp) => {
  return (
    <div>
      <DataTable 
        title='Global'
        data={[
          {
            source: 'Wikipedia',
            ref: 'https://en.wikipedia.org/wiki/2019%E2%80%9320_coronavirus_pandemic_by_country_and_territory#covid19-container',
            ...wikiTotal,
          },
          {
            source: 'ECDC',
            ref: 'https://opendata.ecdc.europa.eu/covid19/casedistribution/json/',
            ...ecdcTotal.total,
          },
          // {
          //   source: 'WHO',
          //   ref: 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/situation-reports',
          //   cases: whoTotal.confirmed,
          //   deaths: whoTotal.totalDeaths,
          // }
        ]}
      />
    </div>
  );
};