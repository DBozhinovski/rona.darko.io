import React from 'react';
import styled from 'styled-components';
import tw from 'tailwind.macro';

const Results = styled.div`
  ${tw`flex flex-col bg-white shadow-md rounded my-4 mx-10`};
  min-width: 33.3%;
`;

const ResGroup = styled.div`
  ${tw`m-10 bg-gray-100`};
`;

const ResGroupTitle = styled.h4`
  ${tw`text-center text-xl`};
`;

const SourceTitle = styled.h2`
  ${tw`text-center text-base text-green-400`};
`

const Data = styled.ul`
  ${tw`p-5 flex flex-col items-center`};
`;

export const SearchResults = ({ wikipediaResults, ecdcResults, whoResults }) => {
  return (
    <Results>
      <SourceTitle>Wikipedia</SourceTitle>
      {
        wikipediaResults.map(wR => {
          return (
            <ResGroup>
              <ResGroupTitle>{wR.name}</ResGroupTitle>
              <Data>
                <li>Cases: {wR.cases}</li>
                <li>Deaths: {wR.deaths}</li>
                <li>Recovered: {wR.recovered}</li>
              </Data>
            </ResGroup>
          );
        })
      }
      <SourceTitle>ECDC</SourceTitle>
      {
        ecdcResults.map(wR => {
          return (
            <ResGroup>
              <ResGroupTitle>{wR.name}</ResGroupTitle>
              <Data>
                <li>Cases: {wR.cases}</li>
                <li>Deaths: {wR.deaths}</li>
                <li>Recovered: {wR.recovered}</li>
              </Data>
            </ResGroup>
          );
        })
      }
      <SourceTitle>WHO</SourceTitle>
      {
        whoResults.map(wR => {
          return (
            <ResGroup>
              <ResGroupTitle>{wR.name}</ResGroupTitle>
              <Data>
                <li>Cases: {wR.cases}</li>
                <li>Deaths: {wR.deaths}</li>
                <li>Recovered: {wR.recovered}</li>
              </Data>
            </ResGroup>
          );
        })
      }
    </Results>
  )
};
