import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import WeatherTable from "./pages/WeatherTable";
import WeatherChart from "./pages/WeatherChart";
import Calculator from "./pages/Calculator";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./pages/Layout";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <WeatherTable />
            </Layout>
          }
        />
        <Route
          path="/chart"
          element={
            <Layout>
              <WeatherChart />
            </Layout>
          }
        />
        <Route
          path="/calculator"
          element={
            <Layout>
              <Calculator />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
