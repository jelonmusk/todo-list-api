// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');


dotenv.config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB connection error:', err));


// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api', require('./routes/todos'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
