const express = require('express');
const axios = require('axios');
const cors = require('cors');

require('dotenv').config(); // To use environment variables

const app = express();

app.use(cors())
const port = process.env.PORT || 5000;
const apiKey = process.env.WEATHERSTACK_API_KEY; // Store your API key in an .env file

// Middleware to serve static files
app.use(express.static('public'));

// Endpoint to fetch weather data
app.get('/weather', async (req, res) => {
  const { city } = req.query;

  if (!city) {
    return res.status(400).send({ error: 'City name is required' });
  }

  try {
    const response = await axios.get(`http://api.weatherstack.com/current`, {
      params: {
        access_key: apiKey,
        query: city,
      },
    });

    if (response.data.error) {
      return res.status(404).send({ error: 'City not found' });
    }

    const weatherData = response.data;
    res.send(weatherData);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'An error occurred while fetching the weather data' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
