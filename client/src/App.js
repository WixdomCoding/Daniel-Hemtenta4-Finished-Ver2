import React, { useState, useEffect } from "react";
import './App.css';

import Info from "./components/info.js";
import Weather from "./components/weather.js";
import QrCode from "./components/qr_code.js";
import Status from "./components/status.js";

function Sign() {
  return (
    <div className="Sign-main">
      <div className="person-info">
        <Info name="Bondhon Shahriar Alam" role="Biträdande Rektor" number="+46 76 108 78 89" mail="bondhon.shahriaralam@ntig.se" img="https://www.bondhon.me/img/bon.jpg"/>
      </div>
      <div className="div-arrow">
      </div>
      <div className="weather-info">
        <Weather />
      </div>
      <div className="qrcode-div">
        <QrCode />
      </div>
      <div className="status-div">
        <Status name='Bond'/>
      </div>
    </div>
  );
}

export default Sign;
