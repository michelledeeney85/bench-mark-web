const express = require('express');
const path = require('path');
const { exec } = require('child_process');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Strict CORS configuration
const allowedOrigins = [
  'http://localhost:5173', // Dev testing localhost address
  // 'https://your-production-domain.com', // Production url
];

app.use(cors({
  origin: function(origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1) {
      // Allow requests from allowed origins
      return callback(null, true);
    } else {
      // Block everything else, including requests with no origin
      return callback(new Error('Not allowed by CORS'), false);
    }
  }
}));

// Endpoint to run the update script
const scriptPath = path.join(__dirname, 'updateOpenBenchData.js');
app.get('/api/update-benches', (req, res) => {
  exec(`node "${scriptPath}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).send('Failed to update bench data');
    }
    res.send('Bench data updated');
  });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});