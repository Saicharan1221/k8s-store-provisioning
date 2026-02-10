const express = require('express');
const cors = require('cors');

console.log('index.js loaded');

const storeRoutes = require('./routes/stores');
console.log('stores routes loaded');

const app = express();
const PORT = 3000;

// 👇 ADD THIS
app.use(cors());

// already present
app.use(express.json());

app.use('/stores', storeRoutes);

app.get('/', (req, res) => {
  res.send('Backend root working');
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
