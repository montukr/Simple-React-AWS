// first server.js to print routes
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON bodies
app.use(express.json());

// Routes
app.get('/',(req,res) => {
	res.send('Welcome to the MERN stack application home page!');
});

app.get('/about', (req, res) => {
    res.send('This is the about page.');
});

app.get('/contact', (req, res) => {
    res.send('Contact us at Facebook.com');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
