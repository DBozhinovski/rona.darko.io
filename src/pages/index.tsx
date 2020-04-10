import React from 'react'
import styled from 'styled-components'
import { graphql } from 'gatsby'
// import tw from 'tailwind.macro'

import Layout from '../components/layout'
import SEO from '../components/seo'

import { GlobalStats } from '../components/GlobalStats';
import { LocalStats } from '../components/LocalStats';

const Container = styled.div`
  width: 75ch;
`;

const IndexPage: React.FunctionComponent = ({ data }) => {
  const wikiTotal = data.allWikiCountryTotal.nodes[0];
  const wikiData = data.allWikiCountry.nodes;
  const ecdcTotal = data.allEcdcCountry.nodes.reduce((acc, country) => {
    const existing = acc[country.countriesAndTerritories] || { cases: 0, deaths: 0 };

    acc[country.countriesAndTerritories] = {
      cases: existing.cases + parseInt(country.cases, 10),
      deaths: existing.deaths + parseInt(country.deaths, 10),
    };

    acc.total = {
      cases: acc.total.cases + parseInt(country.cases, 10),
      deaths: acc.total.deaths + parseInt(country.deaths, 10),
    }

    return acc;
  }, { total: { deaths: 0, cases: 0 } });

  const whoData = data.allWhoCountry.nodes.reduce((acc, country) => {
    const totalCases = parseInt(country.confirmed, 10);
    const totalDeaths = parseInt(country.totalDeaths, 10);

    acc[country.name] = { cases: totalCases, deaths: totalDeaths };
    acc.total = {
      deaths: acc.total.deaths + totalDeaths,
      cases: acc.total.cases + totalCases,
    }

    return acc;
  }, { total: { deaths: 0, cases: 0 } });

  const whoTotal = data.allWhoTotal.nodes[0];

  return (
    <Layout>
      <Container>
        <SEO title="RONA"/>
        <h1>Current COVID-19 world wide status</h1>
        <blockquote><small>Note: due to scraping times, data sources may show different results.</small></blockquote>
        <br />
        <GlobalStats wikiTotal={wikiTotal} whoTotal={whoTotal} ecdcTotal={ecdcTotal} />
        <br />
        <br />
        <hr />
        <hr />
        <br />
        <LocalStats wikiData={wikiData} whoData={whoData} ecdcData={ecdcTotal} />
      </Container>
    </Layout>
  );
};

export default IndexPage;

export const query = graphql`
  query HomePageQuery {
    allEcdcCountry {
      nodes {
        cases
        countriesAndTerritories
        deaths
        countryId
        countryterritoryCode
        dateReported
      }
    }
    allWhoCountry {
      nodes {
        confirmed
        confirmedNew
        name
        newDeaths
        totalDeaths
      }
    }
    allWhoTotal {
      nodes {
        confirmed
        confirmedNew
        newDeaths
        totalDeaths
        latestReportDate
      }
    }
    allWikiCountry {
      nodes {
        cases
        deaths
        name
        recovered
      }
    }
    allWikiCountryTotal {
      nodes {
        cases
        deaths
        recovered
      }
    }
  }
`;
