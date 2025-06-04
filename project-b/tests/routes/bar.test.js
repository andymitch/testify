const request = require('supertest');
const app = require('../../src/app');

describe('GET /bar', () => {
  it('should return items when valid category is provided', async () => {
    const res = await request(app).get('/bar').query({ category: 'electronics' });
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('category', 'electronics');
    expect(res.body).toHaveProperty('totalItems');
    expect(res.body).toHaveProperty('limit');
    expect(res.body).toHaveProperty('items');
    expect(Array.isArray(res.body.items)).toBe(true);
  });

  it('should limit items when limit parameter is provided', async () => {
    const res = await request(app).get('/bar').query({ category: 'books', limit: 2 });
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('category', 'books');
    expect(res.body).toHaveProperty('totalItems');
    expect(res.body).toHaveProperty('limit', 2);
    expect(res.body).toHaveProperty('items');
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.items.length).toBe(2);
  });

  it('should return a 400 error when category is not provided', async () => {
    const res = await request(app).get('/bar');
    
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Category parameter is required');
  });

  it('should return a 404 error when category does not exist', async () => {
    const res = await request(app).get('/bar').query({ category: 'nonexistent' });
    
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error', 'Category not found');
    expect(res.body).toHaveProperty('availableCategories');
    expect(Array.isArray(res.body.availableCategories)).toBe(true);
  });

  it('should return a 400 error when limit is not a valid number', async () => {
    const res = await request(app).get('/bar').query({ category: 'clothing', limit: 'invalid' });
    
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Limit must be a valid number');
  });
});

describe('POST /bar', () => {
  it('should create a resource when valid title, description, and tags are provided', async () => {
    const res = await request(app)
      .post('/bar')
      .send({
        title: 'Test Resource',
        description: 'This is a test resource',
        tags: ['test', 'resource', 'api']
      });
    
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('title', 'Test Resource');
    expect(res.body).toHaveProperty('description', 'This is a test resource');
    expect(res.body).toHaveProperty('tags');
    expect(Array.isArray(res.body.tags)).toBe(true);
    expect(res.body.tags).toEqual(['test', 'resource', 'api']);
    expect(res.body).toHaveProperty('createdAt');
    expect(res.body).toHaveProperty('status', 'published');
  });

  it('should return a 400 error when title is not provided', async () => {
    const res = await request(app)
      .post('/bar')
      .send({
        description: 'This is a test resource',
        tags: ['test', 'resource', 'api']
      });
    
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Title is required');
  });

  it('should return a 400 error when description is not provided', async () => {
    const res = await request(app)
      .post('/bar')
      .send({
        title: 'Test Resource',
        tags: ['test', 'resource', 'api']
      });
    
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Description is required');
  });

  it('should return a 400 error when tags is not provided', async () => {
    const res = await request(app)
      .post('/bar')
      .send({
        title: 'Test Resource',
        description: 'This is a test resource'
      });
    
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Tags must be a valid array');
  });

  it('should return a 400 error when tags is not an array', async () => {
    const res = await request(app)
      .post('/bar')
      .send({
        title: 'Test Resource',
        description: 'This is a test resource',
        tags: 'invalid'
      });
    
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Tags must be a valid array');
  });
});

