import React from 'react';
import './AuthForm.css';
import './Home.css';

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
          The world’s first safe, measurable, and consent-driven extraterrestrial mind-link.
        </p>

        {/* Building hero */}
        <figure className="hero">
          <img
            src={gatewayImg}
            alt="Alien ESP Gateway building at night"
            className="hero-img"
          />
          <figcaption className="caption">
            The Alien ESP Gateway — a fusion of Earth engineering and Zetan resonance
            architecture, built to bridge minds across worlds.
          </figcaption>
        </figure>

        <section className="home-section">
          <h3>What is the Gateway?</h3>
          <p>
            The Alien ESP Gateway is a planetary-scale interface that allows humans and
            extraterrestrials to link minds over vast distances. Using Zetan resonance
            filaments and advanced ESP harmonics, participants can send and receive pure
            thought — not just words, but images, emotions, and concepts. All activity is
            opt-in, recorded, and measured for research purposes. No hidden influence, no
            uninvited intrusion — just true, two-way telepathy.
          </p>
        </section>

        {/* Founders */}
        <section className="home-section">
          <h3>Founders</h3>

          <div className="founders">
            <figure className="card-figure">
              <img
                src={zetaPortrait}
                alt="Tzha’Rel Voq-Senn Ithra’el portrait"
                className="portrait"
              />
              <figcaption className="caption">
                <strong>Tzha’Rel Voq-Senn Ithra’el</strong>
                <br />
                Archivist-Prime of the Quiet Confluence — master of non-local cognition,
                resonance engineering, and ethical mental contact.
              </figcaption>
            </figure>

            <div className="bio">
              <p>
                Tzha’Rel’s species has refined mind-to-mind communication for millennia,
                weaving micro-gravitic resonance filaments into structures that store and
                amplify intention. These constructs make telepathic connections stable,
                clear, and verifiable — preventing corruption or coercion.
              </p>
              <p>
                <strong>Dr. Gabriel Marek</strong>, a human engineer-philosopher, spent his
                early life tuning radios with his grandfather. Fascinated by invisible
                signals, he devoted his career to bridging the gap between human
                neuroscience and alien ESP theory. When he detected Tzha’Rel’s "murmur
                key" in Earth’s ionosphere, he responded — beginning the first
                interspecies mind-link collaboration.
              </p>
            </div>
          </div>
        </section>

        <section className="home-section">
          <h3>How it Started</h3>
          <p>
            Tzha’Rel initiated contact by embedding a subtle mental handshake — the
            "murmur key" — into a low-energy ionospheric resonance. Gabriel decoded it
            using custom-built signal analyzers, discovering it carried not instructions,
            but an invitation. Together, they built the Gateway as neutral ground where
            thought exchange could be initiated only when both sides consent.
          </p>
        </section>

        <section className="home-section">
          <h3>How it Works (Plain English)</h3>
          <ul className="home-list">
            <li>Opt in at the Gateway and agree to mental link protocols.</li>
            <li>
              Zetan resonance filaments align brainwave patterns between participants.
            </li>
            <li>
              Thoughts, emotions, and mental images are shared in real-time and logged
              for study.
            </li>
            <li>
              No mind reading without permission — the link shuts down instantly if
              consent is withdrawn.
            </li>
          </ul>
        </section>

        <div style={{ marginTop: '1rem' }}>
          <a
            className="auth-button"
            href="/register"
            style={{ display: 'inline-block', textAlign: 'center' }}
          >
            Join the Gateway
          </a>
        </div>
      </div>
    </div>
  );
}