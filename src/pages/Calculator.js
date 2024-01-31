import React, { useState } from "react";
import "./Calculator.css";

function Calculator() {
  const [temperature, setTemperature] = useState("");
  const [unit, setUnit] = useState("celsius");
  const [humidity, setHumidity] = useState("");
  const [result, setResult] = useState("");
  const [history, setHistory] = useState([]);

  // Funkcia na výpočet indexu tepla na základe teploty a vlhkosti
  const calculateHeatIndex = () => {
    // Prevod vstupov teploty a vlhkosti na čísla s pohyblivou desatinnou čiarkou
    const temp = parseFloat(temperature);
    const humid = parseFloat(humidity);

    // Skontrolujte, či sú vstupné hodnoty platné čísla
    if (isNaN(temp) || isNaN(humid)) {
      setResult("Please enter valid temperature and humidity values.");
      return;
    }

    // Skontrolujte, či je teplota nižšia ako minimum potrebné na výpočet
    if (
      (unit === "celsius" && temp < 26.7) ||
      (unit === "fahrenheit" && temp < 80)
    ) {
      setResult(
        "Heat Index cannot be calculated for temperatures below 26.7°C or 80°F."
      );
      return;
    }

    // Ak je teplota v stupňoch Fahrenheita, prepočítajte ju na Celzia
    const tempInCelsius = unit === "fahrenheit" ? (temp - 32) * (5 / 9) : temp;

    // Vypočítajte index tepla pomocou vzorca
    const heatIndex =
      -42.379 +
      2.04901523 * tempInCelsius +
      10.14333127 * humid -
      0.22475541 * tempInCelsius * humid -
      6.83783e-3 * tempInCelsius * tempInCelsius -
      5.481717e-2 * humid * humid +
      1.22874e-3 * tempInCelsius * tempInCelsius * humid +
      8.5282e-4 * tempInCelsius * humid * humid -
      1.99e-6 * tempInCelsius * tempInCelsius * humid * humid;

    // Zobrazenie výsledku s dvoma desatinnými miestami a aktualizácia histórie
    setResult(`Heat Index: ${heatIndex.toFixed(2)} °C`);

    saveResultToHistory(`Heat Index: ${heatIndex.toFixed(2)} °C`);
  };

  // Funkcia na uloženie výsledku do histórie, pričom sa zachová posledných 5 výsledkov
  const saveResultToHistory = (result) => {
    const updatedHistory = [...history, result].slice(-5);
    setHistory(updatedHistory);
  };

  return (
    <main className="container calculator">
      <h2>Heat Index Calculator🌡</h2>

      <label htmlFor="temperature">Temperature:</label>
      <input
        type="number"
        id="temperature"
        placeholder="Enter temperature"
        value={temperature}
        onChange={(e) => setTemperature(e.target.value)}
        required
      />

      <label htmlFor="unit">Select temperature unit:</label>
      <select id="unit" value={unit} onChange={(e) => setUnit(e.target.value)}>
        <option value="celsius">°C</option>
        <option value="fahrenheit">°F</option>
      </select>

      <label htmlFor="humidity">Relative Humidity:</label>
      <input
        type="number"
        id="humidity"
        placeholder="Enter humidity"
        value={humidity}
        onChange={(e) => setHumidity(e.target.value)}
        required
      />
      <button onClick={calculateHeatIndex}>Calculate Heat Index</button>

      <p id="result">{result}</p>
      <ul className="list-unstyled">
        <strong>Last 5 Results:</strong>
        {history.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </main>
  );
}

export default Calculator;
