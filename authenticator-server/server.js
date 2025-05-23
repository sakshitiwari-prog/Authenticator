const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();
const cookieParser = require('cookie-parser');

const app = express();
app.use(cors({
    origin: ['http://localhost:3000'], 
    credentials: true
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
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
