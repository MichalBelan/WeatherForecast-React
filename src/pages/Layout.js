import React from "react";
import Header from "../components/Header";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

const Layout = ({ children }) => {
  return (
    <div>
      <Header />
      <Navigation />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
