import { Router } from 'express';
import Scout from "../models/Scout.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

router.get('/', async (req, res) => {
    const scouts = await Scout.find({}, { _id: 0, scoutId: 1, name: 1, status: 1, lastSeenAt: 1, firmware: 1 });
    res.json(scouts);
});

router.get("/:id", async (req, res) => {
    const s = await Scout.findOne({ scoutId: req.params.id });
    if (!s) return res.status(404).json({ message: "Scout not found" });
    res.json(s);
});

router.patch("/:id", async (req, res) => {
  const { name, notes } = req.body || {};
  const s = await Scout.findOneAndUpdate(
    { scoutId: req.params.id },
    { $set: { ...(name !== undefined ? { name } : {}), ...(notes !== undefined ? { notes } : {} ) } },
    { new: true }
  );
  if (!s) return res.status(404).json({ message: "Scout not found" });
  res.json(s);
});

router.post("/:id/command", async (req, res) => {
const { type, params } = req.body || {};
if(!type) return res.status(400).json({ message: "Missing command type is required" });

req.app.get("mqPublish")?.(req.params.id, { type, params});

res.json({ok: true});

});