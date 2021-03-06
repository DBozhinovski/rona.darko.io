import React from 'react'
import styled from 'styled-components'
import { graphql, Link } from 'gatsby'
import tw from 'tailwind.macro'

import Layout from '../components/layout'
import SEO from '../components/seo'

import { GlobalStats } from '../components/GlobalStats';
import { LocalStats } from '../components/LocalStats';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 2em;
  align-items: center;
  width: 100vw;

  div {
    padding: 2em 0;
  }
`;

const Bq = styled.blockquote`
  ${tw`text-center text-sm w-56`};
`;

const IndexPage: React.FunctionComponent = ({ data }) => {
  const wikiTotal = data.allWikiCountryTotal.nodes[0];
  const wikiData = data.allWikiCountry.nodes;
  const ecdcTotal = data.allEcdcCountry.nodes.reduce((acc, country) => {
    const existing = acc[country.countriesAndTerritories] || { cases: 0, deaths: 0, countryCode: country.countryterritoryCode };

    acc[country.countriesAndTerritories] = {
      cases: existing.cases + parseInt(country.cases, 10),
      deaths: existing.deaths + parseInt(country.deaths, 10),
      countryCode: country.countryterritoryCode,
    };

    acc.total = {
      cases: acc.total.cases + parseInt(country.cases, 10),
      deaths: acc.total.deaths + parseInt(country.deaths, 10),
    }

    return acc;
  }, { total: { deaths: 0, cases: 0 } });

  // const whoData = data.allWhoCountry.nodes.reduce((acc, country) => {
  //   const totalCases = parseInt(country.confirmed, 10);
  //   const totalDeaths = parseInt(country.totalDeaths, 10);

  //   acc[country.name] = { cases: totalCases, deaths: totalDeaths };
  //   acc.total = {
  //     deaths: acc.total.deaths + totalDeaths,
  //     cases: acc.total.cases + totalCases,
  //   }

  //   return acc;
  // }, { total: { deaths: 0, cases: 0 } });

  // const whoTotal = data.allWhoTotal.nodes[0];

  const lastScrapedAt = data.allLastScraped.nodes[0];

  return (
    <Layout>
      <Container>
        <SEO title="RONA"/>
        <GlobalStats wikiTotal={wikiTotal} ecdcTotal={ecdcTotal} />
        <LocalStats wikiData={wikiData} ecdcData={ecdcTotal} />
        <Bq>
          Last updated on: {`${lastScrapedAt.year}-${lastScrapedAt.month}-${lastScrapedAt.date} at 16:00 (GMT+1)`}
        </Bq>
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
    allLastScraped {
      nodes {
        date
        month
        year
      }
    }
  }
`;
