import React from 'react'
import Layout from '../components/layout'
import SEO from '../components/seo'
// Import styled from 'styled-components'
// import tw from 'tailwind.macro'
import { graphql } from 'gatsby'

const IndexPage: React.FunctionComponent = ({ data }) => {
  const total = data.allWikiCountry.nodes.reduce((acc, c) => {
    acc.cases = acc.cases + c.cases;
    acc.deaths = acc.deaths + c.deaths;
    acc.recovered = acc.recovered + c.recovered;

    return acc;
  }, {
    cases: 0,
    deaths: 0,
    recovered: 0,
  });

  return (
    <Layout>
      <SEO title="RONA"/>

      <h1>Current COVID-19 WorldWide status</h1>
      <p>
        Cases: {total.cases}
      </p>
      <p>
        Recovered: {total.recovered}
      </p>
      <p>
        Deaths: {total.deaths}
      </p>
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
        daysSinceLastReport
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
  }
`
