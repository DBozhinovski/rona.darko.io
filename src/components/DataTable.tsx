import React from 'react';
import styled from 'styled-components';
import tw from "tailwind.macro"

import { FormatNumber } from './FormatNumber';

interface DTProp {
  data: { 
    source: string,
    name?: string,
    cases: number,
    deaths: number,
    recovered?: number,
    ref?: string,
  }[];
  title: string;
};

const Table = styled.table`
  ${tw`w-full flex flex-row flex-no-wrap sm:bg-white overflow-hidden sm:shadow-lg my-5`};

  @media (min-width: 640px) {
    & {
      display: inline-table !important;
    }
  }
`;

const THead = styled.thead`
  ${tw``};

  @media (min-width: 640px) {
    tr:not(:first-child) {
      display: none;
    }
  }
`;

const TrHead = styled.tr`
  ${tw`bg-gray-200 flex flex-col flex-no-wrap sm:table-row mb-2 sm:mb-0`};
`

const TBody = styled.tbody`
  ${tw`flex-1 sm:flex-none`};
`;

const Tr = styled.tr`
  ${tw`flex flex-col flex-no-wrap sm:table-row mb-2 sm:mb-0`};
`

const Td = styled.td`
  ${tw`border-grey-light border p-3`};
`;

const Th = styled.th`
  ${tw`border-grey-light border p-3 text-left`};
`;

const Title = styled.h2`
  ${tw`text-center text-2xl my-4 underline`}
`;

const DataTable = ({ data, title }: DTProp) => {
  return (
    <div className="container">
      <Title>{title}</Title>
      <Table>
        <THead>
          {
            data.map(() => {
              return (
                <TrHead>
                  <Th>Source</Th>
                  <Th>Cases</Th>
                  <Th>Deaths</Th>
                  <Th>Recovered</Th>
                </TrHead>
              );
            })
          }
        </THead>
        <TBody>
          { 
            data.map((item, i) => {
              return (
                <Tr>
                  <Td>
                    {item.source}
                    <sup><small> <a href={item.ref}>[source]</a></small></sup>
                  </Td>
                  <Td><FormatNumber number={item.cases} /></Td>
                  <Td><FormatNumber number={item.deaths} /></Td>
                  <Td>{item.recovered ? <FormatNumber number={item.recovered} /> : '-'}</Td>
                </Tr>
              );
            })
          }
        </TBody>
      </Table>
    </div>
  );
};

export default DataTable;