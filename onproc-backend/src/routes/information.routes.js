const express = require('express');
const axios = require('axios');

const router = express.Router();

router.get('/information/hotspot', async (req, res) => {
  try {
    // Log the raw query parameters received
    console.log('Received query parameters:', req.query);

    const {
      class: hotspotClass = 'hotspot',
      conf_lvl = 'low',
      enddate = '',
      id = 0,
      loc = JSON.stringify({ stt: 'Indonesia', disp: 'Indonesia' }),
      mode = 'cluster',
      name = 'Hotspot',
      startdate = '',
      time = 'last24h',
      visibility = true
    } = req.query;

    // Parse location properly - only stringify if it's not already a string
    let location;
    try {
      // If loc is already a stringified JSON, parse it first
      const parsedLoc = typeof loc === 'string' ? JSON.parse(loc) : loc;
      location = JSON.stringify(parsedLoc);
    } catch (e) {
      console.error('Error parsing location:', e);
      location = JSON.stringify({ stt: 'Indonesia', disp: 'Indonesia' });
    }

    // Log the processed parameters being sent to BRIN API
    const brinParams = {
      class: hotspotClass,
      conf_lvl,
      enddate,
      id,
      loc: location,
      mode,
      name,
      startdate,
      time,
      visibility
    };
    console.log('Sending request to BRIN API with params:', brinParams);
    console.log('Full BRIN API URL:', `https://hotspot.brin.go.id/getHS?${new URLSearchParams(brinParams).toString()}`);

    const response = await axios.get('https://hotspot.brin.go.id/getHS', {
      params: brinParams
    });
    
    // Log the response status and data length
    console.log('BRIN API Response status:', response.status);
    console.log('BRIN API Response data length:', response.data?.features?.length || 0);
    
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching hotspot data:', error);
    if (error.response) {
      console.error('BRIN API Error response:', {
        status: error.response.status,
        data: error.response.data
      });
    }
    res.status(500).json({ 
      error: 'Failed to fetch hotspot data',
      message: error.message,
      details: error.response?.data
    });
  }
});

router.get('/information/location-lookup', async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ 
        error: 'Missing required parameter',
        message: 'Query parameter "query" is required' 
      });
    }

    const response = await axios.get('https://hotspot.brin.go.id/locLookup', {
      params: {
        txt: query
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching location data:', error);
    res.status(500).json({ 
      error: 'Failed to fetch location data',
      message: error.message 
    });
  }
});

router.get('/information/hotspot/:hsid', async (req, res) => {
  try {
    const { hsid } = req.params;
    
    if (!hsid) {
      return res.status(400).json({ 
        error: 'Missing required parameter',
        message: 'Hotspot ID parameter is required' 
      });
    }

    const response = await axios.get('https://hotspot.brin.go.id/getHSdetail', {
      params: {
        hsid: hsid,
        mode: 'cluster'
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching hotspot detail:', error);
    res.status(500).json({ 
      error: 'Failed to fetch hotspot detail',
      message: error.message 
    });
  }
});

module.exports = router;