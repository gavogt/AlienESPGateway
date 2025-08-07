import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config({path: './.env'});
const app = express();
app.use(cors(), express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewURLParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'));

app.get('/', (req, res) => res.send('Hello from Express!'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server running on port ${PORT}'));
