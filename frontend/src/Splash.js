import React, { useRef, useEffect } from 'react';
import NET from 'vanta/dist/vanta.net.min';
import logo from './assets/logo.png'
import * as THREE from 'three';
import './Splash.css';

export default function Splash({ onFinish }) {

  const ref = useRef(null);

  useEffect(() => {
    const vantaEffect = NET({
      el: ref.current,
      THREE,
      color: 0x0b192a,
      backgroundColor: 0x150633,
      points: 12.0,
      maxDistance: 20.0
    });

    const timer = setTimeout(onFinish, 3000);

return () => {
    vantaEffect.destroy();
    clearTimeout(timer);
    };
}, [onFinish]);
return (
    <div ref={ref} className="splash-container">
      <div className="splash-overlay">
        <img src={logo} alt="Alien Cyborg ESP Gateway Logo" className="splash-logo" />
        <strong className="splash-title">Alien Cyborg ESP Gateway</strong>
      </div>
    </div>
  );
}