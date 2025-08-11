# 🛸 Alien ESP Gateway (MERN + AI)

## Overview

The **Alien ESP Gateway** is an **interstellar contact relay** designed by  
**Tzha’Rel Voq-Senn Ithra’el** (Archivist-Prime of the Quiet Confluence) and  
**Dr. Gabriel Marek** (human engineer-philosopher).

It connects **50+ ESP8266 Scout Nodes** to an **Earth-based Gateway Service**,  
streaming subtle **thought-adjacent telemetry** to researchers in real time.

With integrated **AI analysis** and **autonomous anomaly detection**, the  
gateway also allows researchers to **query the dataset in natural language**  
(via ChatGPT API) and receive **context-aware insights**.

---

## 🚀 Features

- **ESP8266 Scout Firmware**  
  Reads from `AlienCore` modules:
  - 🧠 **NeuroFlux**  
  - ⚡ **PlasmaDensity**  
  - 🌱 **BioResonance**  

- **Real-time Telemetry**  
  MQTT or HTTP → Node.js Gateway → React Dashboard

- **MERN Stack**  
  - **MongoDB**: Historical telemetry archive  
  - **Express**: REST API endpoints  
  - **React**: Cosmic-themed control dashboard  
  - **Node.js + Socket.IO**: Live telemetry streaming

- **Command Center**  
  Calibrate or reboot scouts remotely

- **AI Insights**  
  - 🤖 ChatGPT API integration for natural language data queries  
  - 📊 Statistical + ML anomaly detection for unusual telemetry patterns  
  - 🛠 AI-generated calibration suggestions

- **MCP Server & AI Agent**  
  - **MCP Server**: Exposes telemetry streams and commands via MCP protocol  
  - **AI Agent**: Listens to telemetry events, runs anomaly models, triggers alerts

- **Cosmic UI**  
  Light/dark theme with starlight cyan, void purple, and signal gold

---

## 📜 Scenario

The scouts must:
1. Catalog their connected `AlienCore` readings.
2. Uplink them to the **Alien ESP Gateway Service**.

The gateway:
1. Ingests telemetry via MQTT or HTTP.
2. Validates and stores readings in MongoDB.
3. Runs anomaly detection routines on incoming data.
4. Broadcasts new data via Socket.IO to connected React clients.
5. Accepts control commands from the UI and relays them back to scouts.
6. Answers research queries via **AI Insight API**.

---

## 🗂 Project Structure

```
/firmware     # ESP8266 code
/server       # Express API + Socket.IO + AI Analysis
/client       # React UI
/docker       # Docker Compose files for Node.js, MongoDB, Nginx
/mcp          # MCP server + AI agent scripts
```

---

## ⚙️ Technologies

- **ESP8266** (C/C++)
- **Node.js + Express**
- **MongoDB**
- **Socket.IO** (real-time)
- **React + Chart.js**
- **Docker Compose**
- **MQTT (optional)**: Mosquitto broker
- **OpenAI GPT API**: AI querying & insights
- **Python/Node ML Modules**: Anomaly detection
- **MCP Protocol**: Agent integration

---

## 🧠 AI & Anomaly Detection

**Natural Language Queries**  
Researchers can ask questions like:
- *"Show me last week's highest NeuroFlux spikes."*
- *"Have there been unusual PlasmaDensity fluctuations today?"*

**Anomaly Detection**  
- Statistical thresholds + ML-based time-series anomaly detection (e.g., Prophet, IsolationForest)
- Alerts triggered via Socket.IO → UI
- AI Agent recommendations:
  - Scout recalibration
  - Increased sampling rate
  - Maintenance inspection

---

## 🌐 MCP Server & AI Agent

**MCP Server**  
Serves telemetry data and accepts commands from external AI systems.

**AI Agent**  
Subscribes to MCP server’s telemetry feed:
- Runs anomaly detection in real time
- Sends results back to Gateway → Dashboard
- Can call ChatGPT for interpretive summaries

**Example MCP JSON Frame:**
```json
{
  "type": "telemetry",
  "scoutId": "SCOUT-42",
  "module": "PlasmaDensity",
  "value": 0.983,
  "timestamp": "2025-08-11T05:34:22Z"
}
```

---

## 🛠 Setup Instructions

### 1️⃣ Firmware
- Flash ESP8266 with `/firmware` code
- Configure `/cfg/espconfig.json`:
```json
{
  "wifi_ssid": "CosmosNet",
  "wifi_pass": "********",
  "gateway_url": "http://<server-ip>:3000"
}
```

---

### 2️⃣ Server (Gateway)
```bash
cd server
npm install
npm start
```

---

### 3️⃣ Client (React UI)
```bash
cd client
npm install
npm start
```

---

### 4️⃣ MCP Server + AI Agent
```bash
cd mcp
npm install
node mcp-server.js
node ai-agent.js
```

---

### 5️⃣ Docker (Optional)
```bash
docker-compose up
```

---

## 🔌 API Endpoints

| Method | Endpoint         | Description                     |
|--------|------------------|---------------------------------|
| POST   | /api/telemetry   | Ingest telemetry from scouts    |
| GET    | /api/history     | Query historical telemetry data |
| POST   | /api/command     | Send commands to scouts         |
| POST   | /api/ai/query    | Query data via ChatGPT AI       |

---

## 📡 Socket.IO Events

- `telemetry` – `{ scoutId, type, value, timestamp }`
- `command_ack` – `{ commandId, status }`
- `anomaly_detected` – `{ scoutId, module, severity, details }`

---

## 🎨 Theming

**CSS Variables:**
```css
--starlight-cyan: #00ffff;
--void-purple: #160638;
--signal-gold: #ffb800;
```

Light/Dark mode toggle included.

---

## 📦 Deliverables

- 📜 ESP8266 firmware source + config
- 🖥 MERN gateway service
- 🌌 React cosmic dashboard
- 🤖 AI agent + MCP server
- 🐳 Docker Compose setup
- 📝 README with setup + architecture diagram
- 🎥 Demo video showing live telemetry & AI insights

---
