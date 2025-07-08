const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(express.json());

// Proxy para Binance
app.post('/api/binance', async (req, res) => {
  const { apiKey, secretKey, endpoint, params = {} } = req.body;
  if (!apiKey || !secretKey || !endpoint) {
    return res.status(400).json({ error: 'Faltan parámetros' });
  }
  try {
    // Eliminar timestamp si viene del frontend
    if ('timestamp' in params) delete params.timestamp;
    // Construir query string
    const timestamp = Date.now();
    let queryString = `timestamp=${timestamp}`;
    for (const key in params) {
      queryString += `&${key}=${params[key]}`;
    }
    // Firmar
    const signature = crypto.createHmac('sha256', secretKey).update(queryString).digest('hex');
    queryString += `&signature=${signature}`;
    // Hacer fetch
    const url = `https://api.binance.com${endpoint}?${queryString}`;
    const response = await fetch(url, {
      headers: { 'X-MBX-APIKEY': apiKey }
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Proxy para Alpaca
app.post('/api/alpaca', async (req, res) => {
  const { apiKey, secretKey, endpoint, method = 'GET', body = null } = req.body;
  if (!apiKey || !secretKey || !endpoint) {
    return res.status(400).json({ error: 'Faltan parámetros' });
  }
  try {
    const url = `https://paper-api.alpaca.markets${endpoint}`;
    const response = await fetch(url, {
      method,
      headers: {
        'APCA-API-KEY-ID': apiKey,
        'APCA-API-SECRET-KEY': secretKey,
        'Content-Type': 'application/json'
      },
      body: body ? JSON.stringify(body) : undefined
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
}); 