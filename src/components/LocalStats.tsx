import React, { useState, useEffect } from 'react';
import { geolocated } from "react-geolocated";
import axios from 'axios';
import { FormatNumber } from './FormatNumber';

const fetchCountryData = async (coords, setCountryData, whoData, wikiData, ecdcData) => {
  // console.log(coords);
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
  if (!isGeolocationEnabled) return <div>Geolocation is not enabled, we can't show you the local data for your country.</div>;

  const [countryData, setCountryData] = useState({
    countryName: '',
    wikiData: {},
    whoData: {},
    ecdcData: {},
  });

  useEffect(() => {
    if (coords && coords !== null) {
      fetchCountryData(coords, setCountryData, whoData, wikiData, ecdcData); // Could be prettier :P
    }
  }, [ coords ]);

  return (
    <div>
      {  }
      <h2>Local (showing data for {countryData.countryName})</h2>
      <br /> <br />

      <h3>
        Wikipedia
        <a href="https://en.wikipedia.org/wiki/2019%E2%80%9320_coronavirus_pandemic_by_country_and_territory#covid19-container">
         <sup> <small>[source]</small></sup>
        </a>
      </h3>
      <p>
        Cases: <FormatNumber number={countryData.wikiData.cases} />
      </p>
      <p>
        Recovered: <FormatNumber number={countryData.wikiData.recovered} />
      </p>
      <p>
        Deaths: <FormatNumber number={countryData.wikiData.deaths} />
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
        Cases: <FormatNumber number={countryData.ecdcData.cases} />
      </p>
      <p>
        Deaths: <FormatNumber number={countryData.ecdcData.deaths} />
      </p>
      <br />
      <hr />
      <br />
      <h3>
        WHO
        <a href="https://www.who.int/emergencies/diseases/novel-coronavirus-2019/situation-reports">
         <sup> <small>[source]</small></sup>
        </a>
      </h3>
      <p>
        Cases: <FormatNumber number={countryData.whoData.cases} />
      </p>
      <p>
        Deaths: <FormatNumber number={countryData.whoData.deaths} />
      </p>
    </div>
  );
};

export const LocalStats = geolocated({
  positionOptions: {
      enableHighAccuracy: false,
  },
  userDecisionTimeout: 5000,
})(LocalStatsComponent);