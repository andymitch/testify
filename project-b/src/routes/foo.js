const express = require('express');
const router = express.Router();

/**
 * GET /foo
 * Query parameters: name (string), age (number)
 */
router.get('/', (req, res) => {
  const { name, age } = req.query;
  
  // Validate parameters
  if (!name) {
    return res.status(400).json({ error: 'Name parameter is required' });
  }
  
  // Convert age to number if provided
  const parsedAge = age ? parseInt(age, 10) : null;
  if (age && isNaN(parsedAge)) {
    return res.status(400).json({ error: 'Age must be a valid number' });
  }
  
  // Response
  return res.json({
    message: `Hello, ${name}!`,
    age: parsedAge,
    details: parsedAge ? `You are ${parsedAge} years old` : 'Age not provided',
    timestamp: new Date().toISOString()
  });
});

/**
 * POST /foo
 * Request body: email (string), preferences (object)
 */
router.post('/', (req, res) => {
  const { email, preferences } = req.body;
  
  // Validate parameters
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  
  if (!preferences || typeof preferences !== 'object') {
    return res.status(400).json({ error: 'Preferences must be a valid object' });
  }
  
  // Response
  return res.status(201).json({
    message: 'Data received successfully',
    user: {
      email,
      preferences,
      registeredAt: new Date().toISOString()
    }
  });
});

module.exports = router;

