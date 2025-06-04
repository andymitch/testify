const express = require('express');
const router = express.Router();

// Format functions for different output formats
const formatters = {
  json: (data) => data,
  text: (data) => JSON.stringify(data),
  html: (data) => `<pre>${JSON.stringify(data, null, 2)}</pre>`,
  xml: (data) => {
    // Simple XML conversion (for demonstration purposes)
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<response>\n';
    Object.entries(data).forEach(([key, value]) => {
      xml += `  <${key}>${value}</${key}>\n`;
    });
    xml += '</response>';
    return xml;
  }
};

/**
 * GET /baz
 * Query parameters: id (string), format (string)
 */
router.get('/', (req, res) => {
  const { id, format = 'json' } = req.query;
  
  // Validate parameters
  if (!id) {
    return res.status(400).json({ error: 'ID parameter is required' });
  }
  
  // Check if format is supported
  if (!formatters[format]) {
    return res.status(400).json({ 
      error: 'Unsupported format',
      supportedFormats: Object.keys(formatters)
    });
  }
  
  // Generate mock data based on ID
  const data = {
    id,
    name: `Resource ${id}`,
    description: `This is resource ${id}`,
    createdAt: new Date().toISOString()
  };
  
  // Format the response based on the requested format
  const formattedData = formatters[format](data);
  
  // Set appropriate content type
  if (format === 'json') {
    res.json(formattedData);
  } else if (format === 'html') {
    res.set('Content-Type', 'text/html');
    res.send(formattedData);
  } else if (format === 'xml') {
    res.set('Content-Type', 'application/xml');
    res.send(formattedData);
  } else {
    res.set('Content-Type', 'text/plain');
    res.send(formattedData);
  }
});

/**
 * POST /baz
 * Request body: data (object), timestamp (string)
 */
router.post('/', (req, res) => {
  const { data, timestamp } = req.body;
  
  // Validate parameters
  if (!data || typeof data !== 'object') {
    return res.status(400).json({ error: 'Data must be a valid object' });
  }
  
  // Validate timestamp if provided
  let parsedTimestamp;
  if (timestamp) {
    parsedTimestamp = new Date(timestamp);
    if (isNaN(parsedTimestamp.getTime())) {
      return res.status(400).json({ error: 'Timestamp must be a valid date string' });
    }
  }
  
  // Current server timestamp
  const serverTimestamp = new Date();
  
  // Process data (mock processing)
  const processedData = {
    ...data,
    processed: true,
    requestTimestamp: timestamp ? parsedTimestamp.toISOString() : null,
    serverTimestamp: serverTimestamp.toISOString(),
    processingTime: timestamp ? 
      (serverTimestamp - parsedTimestamp) + 'ms' : 
      'No request timestamp provided'
  };
  
  // Response
  return res.status(201).json({
    success: true,
    message: 'Data processed successfully',
    result: processedData
  });
});

module.exports = router;

