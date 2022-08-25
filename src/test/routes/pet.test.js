const request = require('supertest');
const { app, server } = require('../../index');
const { connect, closeDb } = require('../mockDB');
const { Builder } = require('../mockData');
const { createCompany, collectionItems } = require('../helpers');
const { Pet } = require('../../api/v1/models');

let userData = {},
  jwtToken = {},
  companyData = {},
  pet = {};
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

describe('Pets routes test', () => {
  describe('Company routes for pets', () => {
    test('Should create a pet for the company', async () => {
      const { body } = await request(app)
        .post(`/api/v1/pet/${companyData.admin._id}/create`)
        .send({ ...Builder.createPets('dog'), userId: userData.admin._id })
        .set('jwt_token', jwtToken.admin)
        .expect(200);
      pet['dog'] = body;
      expect(body._id).toStrictEqual(expect.anything());
      expect(body.userId.toString()).toBe(userData.admin._id.toString());
    });

    test('Should create another pet for the company', async () => {
      const { body } = await request(app)
        .post(`/api/v1/pet/${companyData.admin._id}/create`)
        .send({ ...Builder.createPets('cat'), userId: userData.admin._id })
        .set('jwt_token', jwtToken.admin)
        .expect(200);
      pet['cat'] = body;
      expect(body._id).toStrictEqual(expect.anything());
      expect(body.userId.toString()).toBe(userData.admin._id.toString());
    });

    test('The name is unique by userId, should return an error 400 code', async () => {
      const { body } = await request(app)
        .post(`/api/v1/pet/${companyData.admin._id}/create`)
        .send({
          ...Builder.createPets('dogDuplicate'),
          userId: userData.admin._id
        })
        .set('jwt_token', jwtToken.admin)
        .expect(500);
      expect(body.error.message).toBe('AN INTERNAL ERROR HAVE OCCOUR');
    });

    test('User is able to edit the per information, should throw 200 and updated information', async () => {
      pet['dog'].vaccines.push({ name: 'rabia', date: new Date() });
      const { body } = await request(app)
        .put(`/api/v1/pet/${companyData.admin._id}/edit/${pet['dog']._id}`)
        .send(pet['dog'])
        .set('jwt_token', jwtToken.admin)
        .expect(200);
      expect(body).toHaveProperty('updated');
      expect(body.updated).toHaveProperty('vaccines');
      expect(body.updated._id).toBe(pet['dog']._id);
    });

    test('User should be able to list whole pet registers on his companyId', async () => {
      const { body } = await request(app)
        .post(`/api/v1/pet/${companyData.admin._id}/show`)
        .set('jwt_token', jwtToken.admin)
        .expect(200);
      const expectedResults = await collectionItems(Pet, {
        companyId: companyData.admin._id
      });
      expect(body).toHaveProperty('data');
      expect(body.data.length).toBe(expectedResults);
    });

    test('Should return a specific pet document that the user is searching for', async () => {
      const { body } = await request(app)
        .get(`/api/v1/pet/${companyData.admin._id}/index/${pet['dog']._id}`)
        .set('jwt_token', jwtToken.admin)
        .expect(200);
      expect(body).toHaveProperty('data');
      expect(body.data._id).toBe(pet['dog']._id);
    });

    test("Should change the status for pet in order to 'remove' the user from the DB but without lost the data", async () => {
      const { body } = await request(app)
        .put(
          `/api/v1/pet/${companyData.admin._id}/deactivate/${pet['dog']._id}`
        )
        .send({ active: false })
        .set('jwt_token', jwtToken.admin)
        .expect(200);
      expect(body._id).toBe(pet['dog']._id);
      expect(body.active).toBe(false);
    });
  });

  describe('Test for admin routes on pets collection', () => {
    test('As admin and support should create pets for any company id', async () => {
      const { body } = await request(app)
        .post(`/api/v1/pet/create`)
        .send({ ...Builder.createPets('adminDog'), userId: userData.admin._id })
        .set('jwt_token', jwtToken.admin)
        .expect(200);
      pet['dogAdmin'] = body;
      expect(body).toHaveProperty('_id');
      expect(body._id).toStrictEqual(expect.anything());
    });

    test('As admin and support user should search for a specific pet id', async () => {
      const { body } = await request(app)
        .get(`/api/v1/pet/index/${pet.dogAdmin._id}`)
        .set('jwt_token', jwtToken.admin)
        .expect(200);
      expect(body).toHaveProperty('data');
      expect(body.data).toHaveProperty('_id');
      expect(body.data._id).toBe(pet.dogAdmin._id);
    });

    test('As admin and support user should be able to see whole documents', async () => {
      const { body } = await request(app)
        .post(`/api/v1/pet/show`)
        .set('jwt_token', jwtToken.admin)
        .expect(200);
      const expectedResults = await collectionItems(Pet);
      expect(body).toHaveProperty('data');
      expect(body.data.length).toBe(expectedResults);
    });

    test('As admin and support user should be able to edit a specific pet id', async () => {
      const { body } = await request(app)
        .put(`/api/v1/pet/edit/${pet.dogAdmin._id}`)
        .send({ name: 'Ron' })
        .set('jwt_token', jwtToken.admin)
        .expect(200);
      expect(body).toHaveProperty('updated');
      expect(body.updated.name).toBe('Ron');
    });

    test('As admin and support user should be able to delete a specific pet id', async () => {
      const { body } = await request(app)
        .delete(`/api/v1/pet/delete/${pet.dogAdmin._id}`)
        .set('jwt_token', jwtToken.admin)
        .expect(200);
      expect(body).toHaveProperty('removed');
      expect(body.removed).toHaveProperty('_id');
      expect(body.removed._id).toEqual(pet.dogAdmin._id);
    });
  });
});
