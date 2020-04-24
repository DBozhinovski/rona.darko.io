import React from 'react'
import styled from 'styled-components';
import tw from 'tailwind.macro';
import { Chart } from 'react-charts';
import { format, parseISO, set } from 'date-fns'

import Layout from '../components/layout'
import SEO from '../components/seo'

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

const Title = styled.div`
  ${tw`text-center text-2xl`}
`;

const SubTitle = styled.div`
  ${tw`text-center text-l`}
`;

const Report = styled.div`
  ${tw`flex flex-col items-center justify-center`}
`;

const ReportItem = styled.div`
  ${tw`p-0 m-0`}
`;

const Tooltip = ({ getStyle, primaryAxis, datum }) => {
  const data = React.useMemo(
    () =>
      datum
        ? [
            {
              data: datum.group.map(d => ({
                primary: d.series.label,
                secondary: d.secondary,
                color: getStyle(d).fill
              }))
            }
          ]
        : [],
    [datum, getStyle]
  );

  return datum ? (
    <div
      style={{
        color: 'white',
        pointerEvents: 'none'
      }}
    >
      <h3
        style={{
          display: 'block',
          textAlign: 'center'
        }}
      >
        {format(datum.primary, 'dd MMMM yyyy')}
      </h3>
      <div
        style={{
          display: 'flex',
          padding: '2em',
        }}
      >
        <ul>
          {
            data[0].data.map(dat => {
              return (
                <li>{dat.primary}: {dat.secondary}</li>
              );
            })
          }
        </ul>
      </div>
    </div>
  ) : null
};

export default ({ pageContext }) => {
  const { name, countryData } = pageContext;
  const axes = React.useMemo(
    () => [
      { primary: true, type: 'utc', position: 'bottom' },
      { type: 'linear', position: 'left' }
    ],
    []
  );

  const sorted = countryData.map(r => {
    r.dateReported = set(parseISO(r.dateReported), {  minutes: 0, seconds: 0, milliseconds: 0 });
    return r;
  }).sort((a, b) => a.dateReported.getTime() - b.dateReported.getTime());

  const chartData = React.useMemo(
    () => ([
      { label: 'Cases', data: sorted.map(r => ({ x: r.dateReported, y: parseInt(r.cases, 10)})) },
      { label: 'Deaths', data: sorted.map(r => ({ x: r.dateReported, y: parseInt(r.deaths, 10)})) } 
    ]),
    []
  );

  const totalChartData = React.useMemo(
    () => ([
      { 
        label: 'Cases',
        data: sorted.map((r, i) => {
          let total = parseInt(r.cases, 10);
          if (i > 0) {
            for (let j = 0; j < i; j++) {
              total += parseInt(sorted[j].cases, 10);
            }
          }

          return { 
            x: r.dateReported, 
            y: total,
          };
        })
      },
      { 
        label: 'Deaths',
        data: sorted.map((r, i) => {
          let total = parseInt(r.deaths, 10);
          if (i > 0) {
            for (let j = 0; j < i; j++) {
              total += parseInt(sorted[j].deaths, 10);
            }
          }

          return { 
            x: r.dateReported, 
            y: total,
          };
        })
      },
    ]),
    []
  );

  const tooltip = React.useMemo(
    () => ({
      render: ({ datum, primaryAxis, getStyle }) => {
        return <Tooltip {...{ getStyle, primaryAxis, datum }} />
      }
    }),
    []
  )

  return (
    <Layout>
      <SEO title={`Detailed repot for ${name.split('_').join(' ')}`} />
      <Container>
        <Title>
          Per-day report for <b>{name.split('_').join(' ')}</b> <br />
          (as reported by ECDC)
        </Title>
        <div
          style={{
            maxWidth: '900px',
            width: '100%',
            height: '300px'
          }}
          >
          <Chart data={chartData} axes={axes} tooltip={tooltip} />
        </div>
        <SubTitle>Case / death reports per day</SubTitle>

        <div
          style={{
            maxWidth: '900px',
            width: '100%',
            height: '300px'
          }}
          >
          <Chart data={totalChartData} axes={axes} tooltip={tooltip} />
        </div>
        <SubTitle>Total case / death reports per day</SubTitle>
        <Report>
          <h3>Last 24 hours</h3>
          <p>Cases: {sorted[sorted.length - 1].cases}</p>
          <p>Deaths: {sorted[sorted.length - 1].deaths}</p>
          <ReportItem>
          </ReportItem>
          <ReportItem>
          </ReportItem>
        </Report>
      </Container>
    </Layout>
  );
}
