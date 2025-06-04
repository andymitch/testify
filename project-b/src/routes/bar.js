import { Router } from 'express';
const router = Router();

// Mock database of items by category
const mockItems = {
  electronics: [
    { id: 1, name: 'Laptop', price: 999.99 },
    { id: 2, name: 'Smartphone', price: 699.99 },
    { id: 3, name: 'Headphones', price: 199.99 },
    { id: 4, name: 'Tablet', price: 349.99 },
    { id: 5, name: 'Smartwatch', price: 249.99 }
  ],
  books: [
    { id: 1, name: 'The Great Gatsby', price: 12.99 },
    { id: 2, name: '1984', price: 10.99 },
    { id: 3, name: 'To Kill a Mockingbird', price: 14.99 },
    { id: 4, name: 'The Hobbit', price: 16.99 },
    { id: 5, name: 'Harry Potter', price: 19.99 }
  ],
  clothing: [
    { id: 1, name: 'T-Shirt', price: 19.99 },
    { id: 2, name: 'Jeans', price: 39.99 },
    { id: 3, name: 'Sweater', price: 49.99 },
    { id: 4, name: 'Jacket', price: 79.99 },
    { id: 5, name: 'Socks', price: 9.99 }
  ]
};

/**
 * GET /bar
 * Query parameters: category (string), limit (number)
 */
router.get('/', (req, res) => {
  const { category, limit } = req.query;

  // Validate parameters
  if (!category) {
    return res.status(400).json({ error: 'Category parameter is required' });
  }

  const categoryItems = mockItems[category];
  if (!categoryItems) {
    return res.status(404).json({
      error: 'Category not found',
      availableCategories: Object.keys(mockItems)
    });
  }

  // Parse limit
  const parsedLimit = limit ? parseInt(limit, 10) : categoryItems.length;
  if (limit && isNaN(parsedLimit)) {
    return res.status(400).json({ error: 'Limit must be a valid number' });
  }

  // Response with items limited by the specified limit
  const limitedItems = categoryItems.slice(0, parsedLimit);
  return res.json({
    category,
    totalItems: categoryItems.length,
    limit: parsedLimit,
    items: limitedItems
  });
});

/**
 * POST /bar
 * Request body: title (string), description (string), tags (array)
 */
router.post('/', (req, res) => {
  const { title, description, tags } = req.body;

  // Validate parameters
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  if (!description) {
    return res.status(400).json({ error: 'Description is required' });
  }

  if (!tags || !Array.isArray(tags)) {
    return res.status(400).json({ error: 'Tags must be a valid array' });
  }

  // Generate a mock ID and create a resource
  const id = Math.floor(Math.random() * 10000) + 1;
  const createdAt = new Date().toISOString();

  // Response
  return res.status(201).json({
    id,
    title,
    description,
    tags,
    createdAt,
    status: 'published'
  });
});

export default router;
