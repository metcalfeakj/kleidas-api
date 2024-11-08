import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import dotenv from 'dotenv';
import routes from './routes';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/king_james_bible';

mongoose.connect(MONGODB_URI).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});

const limiter = rateLimit({
  windowMs: 6000,
  max: 100,
});

app.use(limiter);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', routes); // Use the routes


export default app;