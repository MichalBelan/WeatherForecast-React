import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";

const WeatherChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);

  // useEffect na načítanie knižnice Google Charts a počiatočných údajov grafu
  useEffect(() => {
    // Funkcia na načítanie knižnice Google Charts a spustenie údajov grafu
    const loadGoogleCharts = async () => {
      try {
        setLoading(true);

        // Asynchrónne načítanie knižnice grafov Google
        await new Promise((resolve, reject) => {
          window.google.charts.load("current", {
            packages: ["corechart"],
            callback: resolve,
          });
        });

        // Nastavenie spätného volania na načítanie teplotného grafu s údajmi predpovede
        window.google.charts.setOnLoadCallback(() =>
          loadTemperatureChart(forecastApiUrl, "Forecast")
        );
      } catch (error) {
        console.error("Error loading Google Charts library:", error);
      } finally {
        setLoading(false);
      }
    };

    // Volanie funkcie na načítanie grafov Google
    loadGoogleCharts();
  }, []);

  // Funkcia na načítanie údajov teplotného grafu zo zadaného API
  const loadTemperatureChart = async (apiUrl, label) => {
    try {
      setLoading(true);

      // Získanie údajov o teplote z rozhrania API
      const response = await fetch(apiUrl);
      const data = await response.json();
      console.log(data);

      // Výpis údajov o čase a teplote z odpovede API
      const time = data.hourly.time.map((time) => new Date(time));
      const temperature = data.hourly.temperature_2m;

      // Pripravte údaje grafu v požadovanom formáte
      const chartData = [["Time", "Temperature (°C)"]];

      for (let i = 0; i < time.length; i++) {
        chartData.push([time[i], temperature[i]]);
      }

      // Nastavenie údajov grafu v stave komponentu
      setChartData(chartData);
    } catch (error) {
      console.error("Error loading temperature data:", error);
    } finally {
      setLoading(false);
    }
  };

  // URL adresy API pre predpoveď a historické údaje o teplote
  const forecastApiUrl =
    "https://api.open-meteo.com/v1/forecast?latitude=51.5085&longitude=-0.1257&hourly=temperature_2m&timezone=Europe%2FLondon";

  const historicalApiUrl =
    "https://archive-api.open-meteo.com/v1/archive?latitude=51.5085&longitude=-0.1257&start_date=2024-01-07&end_date=2024-01-14&hourly=temperature_2m&timezone=Europe%2FLondon";

  return (
    <main className="container">
      <h2>Weather Temperature Chart</h2>
      {loading && <p>Loading...</p>}
      {chartData && (
        <Chart
          width={"100%"}
          height={"400px"}
          chartType="LineChart"
          data={chartData}
          options={{
            title: "Temperature Chart",
            hAxis: {
              title: "Time",
              format: "MMM d, HH:mm",
            },
            vAxis: {
              title: "Temperature (°C)",
            },
          }}
        />
      )}
      <div className="mb-3">
        <button
          onClick={() => loadTemperatureChart(forecastApiUrl, "Forecast")}
          className="mx-2"
        >
          Show Forecast
        </button>
        <button
          onClick={() => loadTemperatureChart(historicalApiUrl, "Historical")}
          className="mx-2"
        >
          Show Historical Data
        </button>
      </div>
    </main>
  );
};

export default WeatherChart;
