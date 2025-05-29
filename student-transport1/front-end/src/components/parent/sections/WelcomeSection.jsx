import React from 'react';
import Tarjeta from '../../../Tarjeta.png';

const WelcomeSection = () => (
  <div className="welcome-section">
    <h1>Bienvenido(a) al sistema</h1>
    <div className="welcome-content">
      <div className="welcome-text">
        <h2>Transporte Escolar Mautick</h2>
        <p>Somos una empresa dedicada al transporte seguro y confiable de estudiantes.</p>
        <p>Garantizamos puntualidad, seguridad y comodidad.</p>
      </div>
      <div className="welcome-image">
        <img src={Tarjeta} alt="Transporte escolar" />
      </div>
    </div>
  </div>
);

export default WelcomeSection;