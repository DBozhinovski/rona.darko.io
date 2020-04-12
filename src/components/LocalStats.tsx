import React, { useState, useEffect } from 'react';
import { geolocated } from "react-geolocated";
import axios from 'axios';

import DataTable from './DataTable';


const fetchCountryData = async (coords, setCountryData, whoData, wikiData, ecdcData) => {
  // const testCoords = {latitude: 42.005429, longitude: 21.367797};
  const res = await axios.get('https://nominatim.openstreetmap.org/reverse', {
    params: {
      lat: coords.latitude,
      lon: coords.longitude,
      format: 'json',
    }
  });

  const countryData = {
    countryName: res.data.address.country,
    wikiData: wikiData.find(c => c.name.includes(res.data.address.country)),
    whoData: (() => { 
      const k = Object.keys(whoData).find(c => c.includes(res.data.address.country));
      return whoData[k]; })(),
    ecdcData: (() => { 
      const k = Object.keys(ecdcData).find(c => c.includes(res.data.address.country));
      return ecdcData[k]; })(),
  };

  setCountryData(countryData);
};

const LocalStatsComponent = ({ wikiData, whoData, ecdcData, isGeolocationAvailable, isGeolocationEnabled, coords }) => {
  if (!isGeolocationAvailable) return <div>Your browser does not support Geolocation.</div>;
  if (!isGeolocationEnabled) return <div>Geolocation is not enabled (or it produced an error), we can't show you the local data for your country.</div>;

  const [countryData, setCountryData] = useState({
    countryName: '',
    wikiData: {
      cases: 0,
      deaths: 0,
      recovered: 0
    },
    whoData: {
      cases: 0,
      deaths: 0,
    },
    ecdcData: {
      cases: 0,
      deaths: 0
    },
  });

  useEffect(() => {
    if (coords && coords !== null) {
      fetchCountryData(coords, setCountryData, whoData, wikiData, ecdcData);
    }
  }, [ coords ]);

  return (
    <div>
      <DataTable
        title={`Local (showing data for ${countryData.countryName})`}
        data={[
          {
            source: 'Wikipedia',
            ref: 'https://en.wikipedia.org/wiki/2019%E2%80%9320_coronavirus_pandemic_by_country_and_territory#covid19-container',
            ...countryData.wikiData,
          },
          {
            source: 'ECDC',
            ref: 'https://opendata.ecdc.europa.eu/covid19/casedistribution/json/',
            ...countryData.ecdcData,
          },
          {
            source: 'WHO',
            ref: 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/situation-reports',
            ...countryData.whoData,
          }
        ]}
      />
    </div>
  );
};

export const LocalStats = geolocated({
  positionOptions: {
      enableHighAccuracy: false,
  },
  userDecisionTimeout: 5000,
})(LocalStatsComponent);