import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { connect as mqttConnect } from 'mqtt';
import authRouter from './routes/auth.js';
import scoutsRouter from './routes/Scouts.js';

const HOST = '0.0.0.0';
const PORT = Number(process.env.PORT || 3000);
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/esp_gateway';
const MQTT_URL = process.env.MQTT_URL || 'mqtt://emqx:1883';
const MQTT_TOPIC = process.env.MQTT_TOPIC || 'esp_gateway/+/telemetry';
const CORS_ORIGINS = (process.env.CORS_ORIGINS || '*').split(',');

const app = express();
app.disable('x-powered-by');
app.use(express.json());
app.use(cors({ origin: (origin, cb) => cb(null, true) }));
app.use('/api/auth', authRouter);
app.use('/api/scouts', scoutsRouter);
app.get('/health', (_req, res) => res.send('ok'));

const server = http.createServer(app);
const io = new SocketIOServer(server, { path: '/socket.io', cors: { origin: CORS_ORIGINS } });

mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => console.log('Mongo connected'))
  .catch(e => console.error('Mongo connect error:', e.message));

app.get('/api/history', async (_req, res) => {
  try {
    const coll = mongoose.connection.collection('telemetry');
    const docs = await coll
      .find({}, { projection: { time: 1, timestamp: 1, module_type: 1, 'tags.module_type': 1, value: 1, 'fields.value': 1 } })
      .sort({ time: 1, timestamp: 1 })
      .limit(200)
      .toArray();

    const rows = docs.map(d => ({
      t: d.time || d.timestamp,
      module_type: d.module_type ?? d?.tags?.module_type ?? 'unknown',
      value: (typeof d.value === 'number') ? d.value : d?.fields?.value
    })).filter(r => r.t && typeof r.value === 'number');

    res.json(rows);
  } catch (e) {
    console.error('/api/history error:', e.message);
    res.json([]);
  }
});

if (process.env.DEBUG_TICKER === '1') {
  setInterval(() => {
    const doc = { time: new Date().toISOString(), module_type: 'PING', value: 20 + Math.random() * 5 };
    io.emit('telemetry', doc);
  }, 2000);
}

const mq = mqttConnect(MQTT_URL, {
  username: process.env.MQTT_USER,
  password: process.env.MQTT_PASS,
  reconnectPeriod: 1000,
});

mq.on('connect', () => {
  console.log('MQTT connected', MQTT_URL, 'sub', MQTT_TOPIC);
  mq.subscribe(MQTT_TOPIC, { qos: 0 }, err => err && console.error('MQTT subscribe error:', err.message));
});

app.set('mqPublish', (scoutId, msg) => {
  const topic = `esp_gateway/${scoutId}/command`;
  mq.publish(topic, JSON.stringify(msg), { qos: 0 });
});

mq.on('message', async (topic, buf) => {
  const txt = buf.toString();

  let msg;
  try { msg = JSON.parse(txt); } catch {}
  if (!msg) {
    const n = Number(txt);
    if (Number.isFinite(n)) msg = { module_type: topic.split('/').pop() || 'UNKNOWN', value: n };
  }
  if (!msg) return;

  const toMs = (x) => {
    const n = Number(x);
    if (Number.isFinite(n)) {
      if (n < 1e12) return n * 1000;
      if (n > 1e14) return Math.floor(n / 1e6);
      return n;
    }
    return new Date(x ?? Date.now()).getTime();
  };

  const ms = toMs(msg.time ?? msg.timestamp ?? Date.now());
  const mod = msg.module_type ?? msg?.tags?.module_type ?? msg.type ?? (topic.split('/')[2] || 'UNKNOWN');
  const val = Number(msg.value ?? msg?.fields?.value);
  const scoutId = topic.split('/')[1] || 'UNKNOWN';
  if (!mod || !Number.isFinite(val)) return;

  const doc = { time: new Date(ms).toISOString(), module_type: mod, value: val };

  io.emit('telemetry', doc);
  try { await mongoose.connection.collection('telemetry').insertOne({ ...doc, topic }); } catch {}

  try {
    const now = new Date();
    await mongoose.connection.collection('scouts').updateOne(
      { scoutId },
      {
        $set: { status: 'online', lastSeenAt: now },
        $setOnInsert: { firmware: '' },
        $addToSet: { modules: { type: mod, unit: '' } }
      },
      { upsert: true }
    );
    await mongoose.connection.collection('scouts').updateOne(
      { scoutId, 'modules.type': mod },
      { $set: { 'modules.$.lastValue': val, 'modules.$.lastSeenAt': now } }
    );
    io.emit('scout_status', { scoutId, status: 'online', lastSeenAt: now.toISOString(), lastModule: mod, lastValue: val });
  } catch (e) {
    console.error('scout upsert error:', e.message);
  }
});

io.on('connection', s => console.log('socket connected', s.id));

server.listen(PORT, HOST, () => {
  console.log(`API listening on http://${HOST}:${PORT}`);
});
