import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { graphql } from 'gatsby';
import Fuse from 'fuse.js';

import tw from 'tailwind.macro';

import Layout from '../components/layout';
import SEO from '../components/seo';
import { SearchResults } from '../components/SearchResults';

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

const Title = styled.h2`
  ${tw`text-center mb-10`};
`;

const Form = styled.form`
  ${tw`bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 mt-4`};
  min-width: 33.3%
`;

const Input = styled.input`
  ${tw`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`};
`;

const ManualSearch: React.FunctionComponent = ({ data }) => {
  const wikiTotal = data.allWikiCountryTotal.nodes[0];
  const wikiData = data.allWikiCountry.nodes;
  const ecdcTotal = data.allEcdcCountry.nodes.reduce((acc, country) => {
    const existing = acc[country.countriesAndTerritories] || { cases: 0, deaths: 0, countryCode: country.countryterritoryCode  };

    acc[country.countriesAndTerritories] = {
      cases: existing.cases + parseInt(country.cases, 10),
      deaths: existing.deaths + parseInt(country.deaths, 10),
      countryCode: country.countryterritoryCode
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

  const [name, setName] = useState('');
  const [results, setResults] = useState({
    wikipediaResults: [],
    ecdcResults: [],
  });

  const wikiSearch = new Fuse(wikiData, { keys: ['name'], threshold: 0.2, minMatchCharLength: 3 });
  const ecdcSearch = new Fuse(Object.keys(ecdcTotal), { threshold: 0.2, minMatchCharLength: 3 });
  // const whoSearch = new Fuse(Object.keys(whoData), { threshold: 0.2, minMatchCharLength: 3 });

  useEffect(() => {
    if (name.length > 2) {
      const test = wikiSearch.search(name);
      console.log(test);

      setResults({
        wikipediaResults: wikiSearch.search(name).map(i => i.item),
        ecdcResults: (() => {
          const res = [];
          const keys = ecdcSearch.search(name).map(i => i.item);
          keys.forEach(k => res.push(Object.assign({}, { name: k }, ecdcTotal[k])));
          console.log(res);

          return res;
        })(),
        // whoResults: (() => { 
        //   const res = [];
        //   const keys = whoSearch.search(name).map(i => i.item);
        //   keys.forEach(k => res.push(Object.assign({}, { name: k }, whoData[k])));

        //   return res; 
        // })(),
      });
    }
  }, [ name ]);

  return (
    <Layout>
      <Container>
        <SEO title="Search"/>
        <Form onSubmit={(e) => { e.preventDefault() }}>
          <Title>Search data per country</Title>
          <Input type="search" placeholder="Country name" onChange={(e) => { setName(e.target.value) }} />
        </Form>
        { name.length > 3 
          ? (
            <SearchResults wikipediaResults={results.wikipediaResults} ecdcResults={results.ecdcResults} />
          ) : <></>
        }
        <Bq>
          Last updated on: {`${lastScrapedAt.year}-${lastScrapedAt.month}-${lastScrapedAt.date} at 16:00 (GMT+1)`}
        </Bq>
      </Container>
    </Layout>
  );
};

export default ManualSearch;

export const query = graphql`
  query SearchPageQuery {
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
