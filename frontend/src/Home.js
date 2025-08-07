import React from 'react';
import { FaSatellite, FaCogs, FaHeartbeat, FaBell } from 'react-icons/fa';
import './Home.css';

export default function Home() {
  const cards = [
    { title: 'Telemetry',  Icon: FaSatellite },
    { title: 'Control',    Icon: FaCogs      },
    { title: 'Diagnostics', Icon: FaHeartbeat },
    { title: 'Alerts',     Icon: FaBell       }
  ];

  return (
    <div className="home-container">
      <section className="hero">
        <h1>An Alien Cyborg ESP Gateway</h1>
        <p>Interface with cosmic ESP signals and planet-bound networks.</p>
        <button className="cta">Initiate</button>
      </section>

      <section className="cards">
        {cards.map(({ title, Icon }) => (
          <div key={title} className="card">
            <div className="icon"><Icon size={48} /></div>
            <h3>{title}</h3>
            <p>Access {title.toLowerCase()} panel</p>
          </div>
        ))}
      </section>
    </div>
  );
}