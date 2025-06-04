const request = require('supertest');
const app = require('../../src/app');

describe('GET /baz', () => {
  it('should return formatted data when id is provided with default json format', async () => {
    const res = await request(app).get('/baz').query({ id: '123' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', '123');
    expect(res.body).toHaveProperty('name', 'Resource 123');
    expect(res.body).toHaveProperty('description', 'This is resource 123');
    expect(res.body).toHaveProperty('createdAt');
  });

  it('should return formatted data in html format when specified', async () => {
    const res = await request(app).get('/baz').query({ id: '123', format: 'html' });

    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toMatch(/text\/html/);
    expect(res.text).toContain('<pre>');
    expect(res.text).toContain('Resource 123');
  });

  it('should return formatted data in text format when specified', async () => {
    const res = await request(app).get('/baz').query({ id: '123', format: 'text' });

    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toMatch(/text\/plain/);
    expect(res.text).toContain('Resource 123');
  });

  it('should return formatted data in xml format when specified', async () => {
    const res = await request(app).get('/baz').query({ id: '123', format: 'xml' });

    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toMatch(/application\/xml/);
    expect(res.text).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(res.text).toContain('<id>123</id>');
    expect(res.text).toContain('<name>Resource 123</name>');
  });

  it('should return a 400 error when id is not provided', async () => {
    const res = await request(app).get('/baz');

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'ID parameter is required');
  });

  it('should return a 400 error when format is not supported', async () => {
    const res = await request(app).get('/baz').query({ id: '123', format: 'invalid' });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Unsupported format');
    expect(res.body).toHaveProperty('supportedFormats');
    expect(Array.isArray(res.body.supportedFormats)).toBe(true);
  });
});

describe('POST /baz', () => {
  it('should process data when valid data object is provided', async () => {
    const res = await request(app)
      .post('/baz')
      .send({
        data: { key1: 'value1', key2: 'value2' }
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('message', 'Data processed successfully');
    expect(res.body).toHaveProperty('result');
    expect(res.body.result).toHaveProperty('key1', 'value1');
    expect(res.body.result).toHaveProperty('key2', 'value2');
    expect(res.body.result).toHaveProperty('processed', true);
    expect(res.body.result).toHaveProperty('serverTimestamp');
  });

  it('should process data with timestamp when provided', async () => {
    const timestamp = new Date().toISOString();
    const res = await request(app)
      .post('/baz')
      .send({
        data: { key1: 'value1', key2: 'value2' },
        timestamp
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('result');
    expect(res.body.result).toHaveProperty('requestTimestamp', timestamp);
    expect(res.body.result).toHaveProperty('processingTime');
  });

  it('should return a 400 error when data is not provided', async () => {
    const res = await request(app)
      .post('/baz')
      .send({
        timestamp: new Date().toISOString()
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Data must be a valid object');
  });

  it('should return a 400 error when data is not an object', async () => {
    const res = await request(app)
      .post('/baz')
      .send({
        data: 'invalid',
        timestamp: new Date().toISOString()
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Data must be a valid object');
  });

  it('should return a 400 error when timestamp is invalid', async () => {
    const res = await request(app)
      .post('/baz')
      .send({
        data: { key1: 'value1', key2: 'value2' },
        timestamp: 'invalid-date'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Timestamp must be a valid date string');
  });
});
