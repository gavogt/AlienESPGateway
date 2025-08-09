# 🛸 Alien ESP Gateway (MERN)

## Overview

The **Alien ESP Gateway** is an interstellar contact relay designed by  
**Tzha’Rel Voq-Senn Ithra’el** (Archivist-Prime of the Quiet Confluence) and  
**Dr. Gabriel Marek** (human engineer-philosopher).

It connects 50+ **ESP8266 Scout Nodes** to an **Earth-based Gateway Service**,  
streaming subtle thought-adjacent telemetry to researchers in real time.

---

## 🚀 Features

- **ESP8266 Scout Firmware**: Reads from `AlienCore` modules (NeuroFlux, PlasmaDensity, BioResonance)
- **Real-time Telemetry** via MQTT or HTTP → Node.js Gateway
- **MERN Stack**:
  - **MongoDB**: Historical data storage
  - **Express**: API endpoints
  - **React**: Cosmic-themed control dashboard
  - **Node.js + Socket.IO**: Live telemetry streaming
- **Command Center**: Calibrate or reboot scouts remotely
- **AI Insights**: Anomaly detection & calibration suggestions
- **Cosmic UI**: Light/dark theme with starlight cyan, void purple, and signal gold

---

## 📜 Scenario

The scouts must:
1. Catalog their connected `AlienCore` readings
2. Uplink them to the **Alien ESP Gateway Service**

The gateway:
1. Ingests telemetry via MQTT or HTTP
2. Validates and stores readings in MongoDB
3. Broadcasts new data via Socket.IO to connected React clients
4. Accepts control commands from the UI and relays them back to scouts

---

## 🗂 Project Structure

/firmware # ESP8266 code
/server # Express API + Socket.IO
/client # React UI
/docker # Docker Compose files for Node.js, MongoDB, Nginx


---

## ⚙️ Technologies

- **ESP8266** (C/C++)
- **Node.js + Express**
- **MongoDB**
- **Socket.IO** (real-time)
- **React + Chart.js**
- **Docker Compose**
- **MQTT (optional)**: Mosquitto broker

---

## 🛠 Setup Instructions

### 1. Firmware
- Flash ESP8266 with `/firmware` code
- Configure `/cfg/espconfig.json` with:
  ```json
  {
    "wifi_ssid": "CosmosNet",
    "wifi_pass": "********",
    "gateway_url": "http://<server-ip>:3000"
  }

2. Server (Gateway)

cd server
npm install
npm start

3. Client (React UI)

cd client
npm install
npm start

4. Docker (Optional)

docker-compose up

🔌 API Endpoints
Method	Endpoint	Description
POST	/api/telemetry	Ingest telemetry from scouts
GET	/api/history	Query historical telemetry data
POST	/api/command	Send commands to scouts
📡 Socket.IO Events

    telemetry – { scoutId, type, value, timestamp }

    command_ack – { commandId, status }

🎨 Theming

CSS Variables:

--starlight-cyan: #00ffff;
--void-purple: #160638;
--signal-gold: #ffb800;

Light/Dark mode toggle included.
📦 Deliverables

ESP8266 firmware source + config

MERN gateway service

React cosmic dashboard

Docker Compose setup

README with setup + architecture diagram

    Demo video showing live telemetry

---
