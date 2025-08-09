import React from 'react';
import './AuthForm.css';
import './Home.css'

import zetaPortrait from './assets/tzha.png';
import gatewayImg from './assets/esp_gateway.png';

export default function Home() {
  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h1 className="auth-title" style={{ marginBottom: '0.5rem' }}>
          Alien ESP Gateway
        </h1>
        <p className="auth-subtitle">
          Consent-based, measurable, thought-adjacent signals. Contact without conquest.
        </p>

        {/* Building hero */}
        <figure className="hero">
          <img src={gatewayImg} alt="Alien ESP Gateway building at night" className="hero-img" />
          <figcaption className="caption">The Alien ESP Gateway — Earth architecture guided by Zetan resonance filaments.</figcaption>
        </figure>

        <section className="home-section">
          <h3>What is the Gateway?</h3>
          <p>
            It’s a safe, opt-in space where people align to a shared “carrier” so subtle
            hunches feel clearer—and can be measured. Full of mind reading. 
          </p>
        </section>

        {/* Founders */}
        <section className="home-section">
          <h3>Founders</h3>

          <div className="founders">
            <figure className="card-figure">
              <img src={zetaPortrait} alt="Tzha’Rel Voq-Senn Ithra’el portrait" className="portrait" />
              <figcaption className="caption">
                <strong>Tzha’Rel Voq-Senn Ithra’el</strong><br />
                Archivist-Prime of the Quiet Confluence. Specialist in non-local cognition and ethical contact.
              </figcaption>
            </figure>

            <div className="bio">
              <p>
                Tzha’Rel’s people weave micro-gravitic filaments into matter so buildings can “hold intention”
                like a tuning fork holds pitch. Ethics first: no coercion, full consent, shared benefit.
              </p>
              <p>
                <strong>Dr. Gabriel Marek</strong> is a generous engineer-philosopher who grew up fixing radios
                with his grandfather. His rule: tools should feel like gifts, not gates. When a faint carrier
                brushed his SDR, he listened—and started building.
              </p>
            </div>
          </div>
        </section>

        <section className="home-section">
          <h3>How it Started</h3>
          <p>
            Tzha’Rel seeded a harmless “murmur key” in Earth’s ionosphere—more lighthouse than signal.
            Gabriel reconstructed the pattern and found <em>guidelines</em>: safety, consent, reciprocity.
            Together they built a place where imagination meets data—and doors open only when everyone says “yes.”
          </p>
        </section>

        <section className="home-section">
          <h3>How it Works (Plain English)</h3>
          <ul className="home-list">
            <li>Opt in and state your intent (no surprises).</li>
            <li>Zetan filaments gently align participants to a shared carrier.</li>
            <li>Hunches are logged as data (timing, accuracy, biosignals).</li>
            <li>No mass influence, no mind reading—consent required.</li>
          </ul>
        </section>

        <div style={{ marginTop: '1rem' }}>
          <a className="auth-button" href="/register" style={{ display: 'inline-block', textAlign: 'center' }}>
            Join the Gateway
          </a>
        </div>
      </div>
    </div>
  );
}