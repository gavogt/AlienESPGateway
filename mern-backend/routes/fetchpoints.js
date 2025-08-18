import { Router } from 'express';
import mongoose from 'mongoose';

const router = Router();

router.get('/recent', async (req, res) => {
  const limit  = Number.parseInt(String(req.query.limit ?? ''), 10) || 200;
  const sensor = typeof req.query.sensor === 'string' ? req.query.sensor.trim() : undefined;

  const pipeline = [
    { $unwind: "$modules" },
    ...(sensor ? [{ $match: { "modules.type": sensor } }] : []),
    { $match: { "modules.lastSeenAt": { $type: "date" }, "modules.lastValue": { $type: "number" } } },
    { $project: {
        k: "$modules.type",
        t: { $toLong: "$modules.lastSeenAt" }, // Date → epoch ms
        v: "$modules.lastValue",
      }
    },
    { $sort: { t: -1 } },
    { $limit: limit }
  ];

  try {
    await mongoose.connection.asPromise(); // wait until connected
    const db = mongoose.connection.db;
    if (!db) return res.status(503).json({ error: "Database not ready" });

    const points = await db.collection('scouts').aggregate(pipeline).toArray();
    res.json({ points });
  } catch (err) {
    console.error('/api/telemetry/recent error:', err?.message || err);
    res.status(500).json({ error: err?.message || String(err) });
  }
});

export default router;