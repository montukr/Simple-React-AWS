// server.js to connect with mongodb
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Connect to MongoDB
const uri = process.env.MONGODB_URI;
mongoose.connect(uri)
  .then(() => console.log("MongoDB connection established successfully"))
  .catch(err => console.error("MongoDB connection error:", err));

// Define routes
// app.use('/api/items', require('./routes/api/items')); // Example route

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
