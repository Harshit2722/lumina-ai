require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes')
const {errorMiddleware} = require('./middlewares/errorMiddleware');
const cookieParser = require('cookie-parser');

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser())
app.use(cors({ 
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true 
}));
app.use(morgan('dev'));


// Routes Placeholder
app.use('/api/v1/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('AI SaaS API is running...');
});

app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
