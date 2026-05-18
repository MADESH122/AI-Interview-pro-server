const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// CORS Configuration
app.use(cors({
  origin: '*',
  credentials: true
}));

app.use(express.json());

// Root Route
app.get('/', (req, res) => {
  res.json({ 
    message: "✅ AI Interview Pro Backend is Running!",
    status: "OK",
    version: "1.0"
  });
});

// MongoDB Connection with Better Options
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 30000,
})
.then(() => console.log("✅ MongoDB Atlas Connected Successfully"))
.catch(err => {
  console.error("❌ MongoDB Connection Error:", err);
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/questions', require('./routes/questionRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});