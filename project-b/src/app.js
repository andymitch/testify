import express, { json, urlencoded } from 'express';
const app = express();

// Middleware
app.use(json());
app.use(urlencoded({ extended: true }));

// Import routes
import fooRoutes from './routes/foo';
import barRoutes from './routes/bar';
import bazRoutes from './routes/baz';

// Use routes
app.use('/foo', fooRoutes);
app.use('/bar', barRoutes);
app.use('/baz', bazRoutes);

// Default route
app.get('/', (_, res) => {
  res.json({ message: 'Welcome to the API' });
});

export default app;
