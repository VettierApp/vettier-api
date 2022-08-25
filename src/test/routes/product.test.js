const request = require('supertest');
const mongoose = require('mongoose');
const { app, server } = require('../../index');
const { connect, closeDb } = require('../mockDB');
const { Builder } = require('../mockData');
const { createCompany, collectionItems } = require('../helpers');
const { Product } = require('../../api/v1/models');
const { expectCt } = require('helmet');

let userData = {},
  jwtToken = {},
  companyData = {},
  products = [];
beforeAll(async () => {
  await connect();
  const { company, user, token } = await createCompany();
  userData['admin'] = { ...user };
  jwtToken['admin'] = token;
  companyData['admin'] = { ...company };
});

afterAll(async () => {
  await closeDb();
  return server.close();
});

describe('Products endpoints cases', () => {
  describe('Regular user permissions', () => {
    test('Should create a user in the DB and return 200 and new product created', async () => {
      const product = Builder.createProduct({
        name: 'T-Shirt',
        costValue: 5000,
        reference: 'AAA123',
        stock: 100,
        price: 20000
      });
      const { body } = await request(app)
        .post(`/api/v1/product/${companyData.admin._id}/create`)
        .send({ ...product, companyId: companyData.admin._id })
        .set('jwt_token', jwtToken.admin)
        .expect(200);
      products.push(body);
      expect(body).toHaveProperty('_id');
      expect(body._id).toStrictEqual(expect.anything());
    });

    test('Should create a user in the DB and return 200 and new product created', async () => {
      const { body } = await request(app)
        .put(
          `/api/v1/product/${companyData.admin._id}/update/${products[0]._id}`
        )
        .send({ description: 'My first shirt' })
        .set('jwt_token', jwtToken.admin)
        .expect(200);
      expect(body).toHaveProperty('updated');
      expect(body.updated._id).toBe(products[0]._id);
    });

    test("Shouldn't create a duplicate name, reference and company id product", async () => {
      const product = Builder.createProduct({
        name: 'T-Shirt',
        costValue: 5000,
        reference: 'AAA123',
        stock: 100,
        price: 20000
      });
      const { body } = await request(app)
        .post(`/api/v1/product/${companyData.admin._id}/create`)
        .send({ ...product, companyId: companyData.admin._id })
        .set('jwt_token', jwtToken.admin)
        .expect(500);
    });

    test('Should create a new product with different reference but same name', async () => {
      const product = Builder.createProduct({
        name: 'T-Shirt',
        costValue: 5000,
        reference: 'AAA321',
        stock: 100,
        price: 20000
      });
      const { body } = await request(app)
        .post(`/api/v1/product/${companyData.admin._id}/create`)
        .send({ ...product, companyId: companyData.admin._id })
        .set('jwt_token', jwtToken.admin)
        .expect(200);
      products.push(body);
      expect(body).toHaveProperty('_id');
    });

    test('Should receive all products for the company id', async () => {
      const { body } = await request(app)
        .post(`/api/v1/product/${companyData.admin._id}/show`)
        .set('jwt_token', jwtToken.admin)
        .expect(200);
      const expectedResults = await collectionItems(Product);
      expect(body).toHaveProperty('data');
      expect(body.data.length).toBe(expectedResults);
    });

    test('Should show a specific product by id', async () => {
      const { body } = await request(app)
        .get(
          `/api/v1/product/${companyData.admin._id}/index/${products[1]._id}`
        )
        .set('jwt_token', jwtToken.admin)
        .expect(200);
      expect(body).toHaveProperty('data');
      expect(body.data).toHaveProperty('_id');
      expect(body.data._id).toBe(products[1]._id);
    });
  });

  describe('Should test all endpoints for admins and supports', () => {
    test('Should create a new product for any company', async () => {
      const product = Builder.createProduct({
        name: 'Jeans',
        reference: 'BBB123',
        stock: 10,
        costValue: 20000,
        price: 120000
      });
      const { body } = await request(app)
        .post(`/api/v1/product/create`)
        .send({ ...product, companyId: companyData.admin._id })
        .set('jwt_token', jwtToken.admin)
        .expect(200);
      products.push(body);
      expect(body).toHaveProperty('_id');
    });

    test('Should update a specific product by id as admin role', async () => {
      const description = 'Cowboy jeans';
      const { body } = await request(app)
        .put(`/api/v1/product/edit/${products.at(0)._id}`)
        .send({ description })
        .set('jwt_token', jwtToken.admin)
        .expect(200);
      expect(body).toHaveProperty('updated');
      expect(body.updated._id).toBe(products.at(0)._id);
      expect(body.updated.description).toBe(description);
    });

    test('Should return all records for products as admin', async () => {
      const { body } = await request(app)
        .post(`/api/v1/product/show`)
        .set('jwt_token', jwtToken.admin)
        .expect(200);
      const expectedResults = await collectionItems(Product);
      expect(body).toHaveProperty('data');
      expect(body.data.length).toBe(expectedResults);
    });

    test('As admin should be able to search for a specific product by id', async () => {
      const { body } = await request(app)
        .get(`/api/v1/product/index/${products.at(0)._id}`)
        .set('jwt_token', jwtToken.admin)
        .expect(200);
      expect(body).toHaveProperty('data');
      expect(body.data._id).toBe(products.at(0)._id);
    });
  });
});
