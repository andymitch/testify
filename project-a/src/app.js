const express = require('express');
const app = express();


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const fooRoutes = require('./routes/foo');
const barRoutes = require('./routes/bar');
const bazRoutes = require('./routes/baz');

// Use routes
app.use('/foo', fooRoutes);
app.use('/bar', barRoutes);
app.use('/baz', bazRoutes);

// Default route
app.get('/', (_, res) => {
  res.json({ message: 'Welcome to the API' });
});

module.exports = app;
