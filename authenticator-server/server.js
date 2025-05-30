const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();
const cookieParser = require('cookie-parser');

const app = express();
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://192.168.1.11:3000',
    'https://9d58-2401-4900-1c54-4e76-fdc3-5b9b-b9cd-e8a1.ngrok-free.app'
  ],
  credentials: true,
  allowedHeaders: ['Content-Type', 'X-Forwarded-Referer', 'Authorization']

}));

app.use(cookieParser());
app.use(express.json());
app.use((req, res, next) => {
  console.log('Origin:', req.headers.origin);
  next();
});
mongoose.connect(process.env.MONGO_URI);

app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT,'0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
