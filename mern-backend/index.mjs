import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const HOST = '0.0.0.0';
const PORT = Number(process.env.PORT || 3000);
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/esp_gateway';

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(MONGO_URI).then(() => console.log('Mongo connected')).catch(e => {
  console.error('Mongo connect error:', e.message);
});

app.get('/health', (_req, res) => res.send('ok'));

app.get('/api/history', async (_req, res) => {
  try {
    const coll = mongoose.connection.collection('telemetry');
    const docs = await coll
      .find({}, { projection: { time: 1, timestamp: 1, module_type: 1, 'tags.module_type': 1, value: 1, 'fields.value': 1 } })
      .sort({ time: 1, timestamp: 1 })
      .limit(200)
      .toArray();

    const rows = docs
      .map(d => ({
        t: d.time || d.timestamp,
        module_type: d.module_type ?? d?.tags?.module_type ?? 'unknown',
        value: (typeof d.value === 'number') ? d.value : d?.fields?.value
      }))
      .filter(r => r.t && typeof r.value === 'number');

    res.json(rows);
  } catch (e) {
    console.error('/api/history error:', e.message);
    res.json([]); // simple fallback so the request never resets
  }
});

app.listen(PORT, HOST, () => {
  console.log(`API listening on http://${HOST}:${PORT}`);
});