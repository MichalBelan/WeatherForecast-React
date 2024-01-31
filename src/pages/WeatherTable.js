import React, { useEffect, useState } from "react";
import "datatables.net-dt/css/jquery.dataTables.css";
import "datatables.net";
import $ from "jquery";
import "./WeatherTable.css";

const WeatherTable = () => {
  const [loading, setLoading] = useState(false);

  // Inicializácia DataTable pre tabuľku s ID 'weatherTable'
  const weatherTable = $("#weatherTable").DataTable({
    paging: true,
    pageLength: 10,
    ordering: true,
    searching: true,
  });

  // URL adresy API pre predpoveď a historické údaje o počasí
  const forecastApiUrl =
    "https://api.open-meteo.com/v1/forecast?latitude=51.5085&longitude=-0.1257&hourly=temperature_2m,relative_humidity_2m,weather_code,surface_pressure&timezone=Europe%2FLondon";
  const historicalApiUrl =
    "https://archive-api.open-meteo.com/v1/archive?latitude=51.5085&longitude=-0.1257&start_date=2024-01-17&end_date=2024-01-24&hourly=temperature_2m,relative_humidity_2m,weather_code,surface_pressure&timezone=Europe%2FLondon";

  // Mapovanie počasia ,zodpovedajúce opisy
  const weatherCodeMapping = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Cloudy",
  };

  // Asynchrónna funkcia na načítanie údajov o počasí zo zadaného rozhrania API
  const loadData = async (apiUrl) => {
    try {
      setLoading(true);
      // Získavanie údajov z rozhrania API
      const response = await fetch(apiUrl);
      const data = await response.json();

      // Vymazanie existujúcich údajov v tabuľke DataTable
      weatherTable.clear();
      // Skontrolujte, či sú k dispozícii hodinové údaje o počasí v očakávanom formáte
      if (data.hourly && Array.isArray(data.hourly.relative_humidity_2m)) {
        const time = data.hourly.time;
        const temperature = data.hourly.temperature_2m;
        const humidity = data.hourly.relative_humidity_2m;
        const pressure = data.hourly.surface_pressure;
        const weatherState = data.hourly.weather_code;

        // Pridanie každého riadku údajov o počasí do tabuľky DataTable
        time.forEach((timestamp, index) => {
          weatherTable.row.add([
            new Date(timestamp).toLocaleString(),
            weatherCodeMapping[weatherState[index]],
            `${temperature[index]} °C`,
            `${humidity[index]} %`,
            `${pressure[index]} hPa`,
          ]);
        });

        // Prekreslenie tabuľky DataTable s novými údajmi
        weatherTable.draw();
      } else {
        console.error(
          "Hourly weather data is not available or not in the expected format"
        );
      }
    } catch (error) {
      // Zaznamenanie chyby, ak nastane problém s načítaním údajov o počasí
      console.error("Error fetching weather data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Načítanie údajov o počasí pri načítaní komponentu
  useEffect(() => {
    loadData(forecastApiUrl);
  }, []);

  return (
    <div className="weather-table-container">
      <h2>Weather Forecast for London</h2>
      <div className="btn-group">
        <button
          id="forecastBtn"
          onClick={() => loadData(forecastApiUrl)}
          disabled={loading}
        >
          {loading ? "Loading Forecast..." : "Load Forecast"}
        </button>
        <button
          id="historicalBtn"
          onClick={() => loadData(historicalApiUrl)}
          disabled={loading}
        >
          {loading ? "Loading Historical Data..." : "Load Historical Data"}
        </button>
      </div>

      <table className="table" id="weatherTable">
        <thead>
          <tr>
            <th>Datetime</th>
            <th>Weather State</th>
            <th>Temperature</th>
            <th>Relative Humidity</th>
            <th>Surface Pressure</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
  );
};

export default WeatherTable;
