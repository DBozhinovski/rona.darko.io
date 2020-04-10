import React from 'react';

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
  whoTotal: {
    total: {
      confimed: number;
      totalDeaths: number;
    }
  }
}

export const GlobalStats = ({ wikiTotal, ecdcTotal, whoTotal }: GlobalStatsProp) => {
  return (
    <div>
      <h2>Global</h2>
        <br /> <br />

        <h3>
          Wikipedia
          <a href="https://en.wikipedia.org/wiki/2019%E2%80%9320_coronavirus_pandemic_by_country_and_territory#covid19-container">
          <sup> <small>[source]</small></sup>
          </a>
        </h3>
        <p>
          Cases: {wikiTotal.cases}
        </p>
        <p>
          Recovered: {wikiTotal.recovered}
        </p>
        <p>
          Deaths: {wikiTotal.deaths}
        </p>
        <br />
        <hr />
        <br />
        <h3>
          ECDC
          <a href="https://opendata.ecdc.europa.eu/covid19/casedistribution/json/">
          <sup> <small>[source]</small></sup>
          </a>
        </h3>
        <p>
          Cases: {ecdcTotal.total.cases}
        </p>
        <p>
          Deaths: {ecdcTotal.total.deaths}
        </p>
        <br />
        <hr />
        <br />
        <h3>
          WHO
          <a href="https://www.who.int/emergencies/diseases/novel-coronavirus-2019/situation-reports">
          <sup> <small>[source]</small></sup>
          </a>
          <blockquote>
            <small>
              Note: due to the fact that this is parsed via PDF, it may be wrong sometimes. However, the per-country data is still valid.
              <a href="#"> Click here for details.</a>
            </small>
          </blockquote>
        </h3>
        <p>
          Cases: {whoTotal.confirmed}
        </p>
        <p>
          Deaths: {whoTotal.totalDeaths}
        </p>
    </div>
  );
};