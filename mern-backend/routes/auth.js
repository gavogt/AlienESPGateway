import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import User from "../models/User.js";

const router = express.Router();

// debug route to check if the API is reachable
// GET /api/auth/_ping
router.get("/_ping", (_req, res) => res.json({ ok: true, where: "/api/auth" }));

// POST /api/auth/register
router.post(
  "/register",
  [
    body("email").isEmail(),
    body("password").isLength({ min: 1 }),
    body("name").optional().isString()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password, name } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "Email already registered" });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ email, passwordHash, name });

    res.status(201).json({ id: user._id, email: user.email, name: user.name });
  }
);

// POST /api/auth/login
router.post(
  "/login",
  [body("email").isEmail(), body("password").isString()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { sub: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES || "7d" }
    );
    res.json({ token, user: { id: user._id, email: user.email, name: user.name, role: user.role } });
  }
);

export default router;