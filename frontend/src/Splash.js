import React, { useRef, useEffect } from "react";
import NET from "vanta/dist/vanta.net.min";
import * as THREE from "three";
import logo from "./assets/logo.png";
import "./Splash.css"

export default function Splash({ onFinish }) {
  const ref = useRef(null);
  const vanta = useRef(null);

  const hasWebGL = () => {
    try {
      const c = document.createElement("canvas");
      return !!(c.getContext("webgl") || c.getContext("experimental-webgl"));
    } catch { return false; }
  };

  useEffect(() => {
    if (vanta.current) return;

    const tryInit = () => {
      const el = ref.current;
      if (!el) return;
      const sized = el.offsetWidth > 0 && el.offsetHeight > 0;
      if (!sized || !hasWebGL()) return false;
      try {
        vanta.current = NET({ el, THREE });
        return true;
      } catch { return false; }
    };

    if (!tryInit()) requestAnimationFrame(() => tryInit());
    const ro = new ResizeObserver(() => !vanta.current && tryInit());

    ref.current && ro.observe(ref.current);
    const t = setTimeout(() => onFinish?.(), 3000);

    return () => {
      ro.disconnect();
      clearTimeout(t);
      vanta.current?.destroy();
      vanta.current = null;
    };
  }, [onFinish]);

  return (
    <div ref={ref} style={{ minHeight: "100vh", width: "100%" }} className="splash-container">
      <div className="splash-overlay">
        <img src={logo} alt="Alien Cyborg ESP Gateway Logo" className="splash-logo" />
        <strong className="splash-title">Alien Cyborg ESP Gateway</strong>
      </div>
    </div>
  );
}