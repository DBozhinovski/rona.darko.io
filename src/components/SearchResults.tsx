import React from 'react';
import styled from 'styled-components';
import tw from 'tailwind.macro';
import { Link } from 'gatsby'

const Results = styled.div`
  ${tw`flex flex-col bg-white shadow-md rounded my-4 mx-10`};
  min-width: 33.3%;
`;

const ResGroup = styled.div`
  ${tw`flex flex-col items-center justify-center m-10 bg-gray-100`};

  p {
    ${tw`p-5`};
  }
`;

const ResGroupTitle = styled.h4`
  ${tw`text-center text-xl`};
`;

const SourceTitle = styled.h2`
  ${tw`text-center text-base py-4 mb-2 text-green-400 border-b-2 border-t-2 border-dashed border-green-200`};
`

const Data = styled.ul`
  ${tw`p-5 flex flex-col items-center`};
`;

export const SearchResults = ({ wikipediaResults, ecdcResults, whoResults }) => {
  return (
    <Results>
      <SourceTitle key={`wiki-res`}>Wikipedia</SourceTitle>
      { wikipediaResults.length === 0 
        ? <ResGroup><p>No results found.</p></ResGroup>
        : wikipediaResults.map((wR, i)=> {
          return (
            <ResGroup key={`wiki-res-${wR.name}`}>
              <ResGroupTitle>{wR.name}</ResGroupTitle>
              <Data>
                <li key={`wiki-${wR.name}-cases`}>Cases: {wR.cases}</li>
                <li key={`wiki-${wR.name}-deaths`}>Deaths: {wR.deaths}</li>
                <li key={`wiki-${wR.name}-recovered`}>Recovered: {wR.recovered}</li>
              </Data>
            </ResGroup>
          );
        })
      }
    
      <SourceTitle key={`ecdc-res`}>ECDC</SourceTitle>
      { ecdcResults.length === 0
        ? <ResGroup><p>No results found.</p></ResGroup>
        : ecdcResults.map(eR => {
          return (
            <ResGroup key={`ecdc-res-${eR.name}`}>
              <ResGroupTitle>{eR.name}</ResGroupTitle>
              <Data>
                <li key={`ecdc-${eR.name}-cases`}>Cases: {eR.cases}</li>
                <li key={`wiki-${eR.name}-deaths`}>Deaths: {eR.deaths}</li>
              </Data>
              <Link to={`/reports/${eR.countryCode}`}>[ECDC detailed report]</Link>
            </ResGroup>
          );
        })
      }
      <SourceTitle key={`who-res`}>WHO</SourceTitle>
      { whoResults.length === 0
        ? <ResGroup><p>No results found.</p></ResGroup>
        : whoResults.map(wR => {
          return (
            <ResGroup key={`who-res-${wR.name}`}>
              <ResGroupTitle>{wR.name}</ResGroupTitle>
              <Data>
                <li key={`who-${wR.name}-cases`}>Cases: {wR.cases}</li>
                <li key={`who-${wR.name}-deaths`}>Deaths: {wR.deaths}</li>
              </Data>
            </ResGroup>
          );
        })
      }
    </Results>
  )
};
