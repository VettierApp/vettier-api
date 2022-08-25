const request = require('supertest');
const mongoose = require('mongoose');
const { app, server } = require('../../index');
const { connect, closeDb } = require('../mockDB');
const { Builder } = require('../mockData');
const { createCompany, createUser } = require('../helpers');

let userData = {},
  jwtToken = {},
  companyData = {},
  vaccinationId = {};

beforeAll(async () => {
  await connect();
  const { company, user, token } = await createCompany('owner');
  userData['owner'] = { ...user };
  jwtToken['owner'] = token;
  companyData['owner'] = { ...company };
  const { user: adminUser, token: adminToken } = await createUser('admin');
  userData['admin'] = adminUser;
  jwtToken['admin'] = adminToken;
});

afterAll(async () => {
  await closeDb();
  return server.close();
});

describe('Vaccination Routes', () => {
  describe('Vaccination Routes attached to company id', () => {
    test('Should Create  a Vaccination as an owner', async () => {
      const { body } = await request(app)
        .post(`/api/v1/vaccination/${companyData.owner._id}/create`)
        .set('jwt_token', jwtToken.owner)
        .send({
          ...Builder.vaccination(),
          companyId: companyData.owner._id
        })
        .expect(200);
      vaccinationId['owner'] = body._id;

      expect(body._id.toString()).toBeDefined();
      expect(body.companyId.toString()).toEqual(
        companyData.owner._id.toString()
      );
      expect(body.createdAt.toString()).toBeDefined();
      expect(body.updatedAt.toString()).toBeDefined();
    });

    test('Should List All Vaccinations as an owner', async () => {
      const { body } = await request(app)
        .post(`/api/v1/vaccination/${companyData.owner._id}/show`)
        .set('jwt_token', jwtToken.owner)
        .expect(200);

      expect(body.data.length).toBe(1);
    });

    test('Should Edit a Vaccination as an owner', async () => {
      const { body } = await request(app)
        .put(
          `/api/v1/vaccination/${companyData.owner._id}/update/${vaccinationId['owner']}`
        )
        .set('jwt_token', jwtToken.owner)
        .send({ lot: 'B-2' })
        .expect(200);

      expect(body.updated.lot).toBe('B-2');
      expect(body.updated.companyId._id.toString()).toEqual(
        companyData.owner._id.toString()
      );
    });

    test('Should Get One Vaccination as an owner', async () => {
      const { body } = await request(app)
        .get(
          `/api/v1/vaccination/${companyData.owner._id}/index/${vaccinationId['owner']}`
        )
        .set('jwt_token', jwtToken.owner)
        .expect(200);

      expect(body.data._id.toString()).toBeDefined();
    });

    test('Should delete One Vaccination as an owner', async () => {
      const { body } = await request(app)
        .delete(
          `/api/v1/vaccination/${companyData.owner._id}/delete/${vaccinationId['owner']}`
        )
        .set('jwt_token', jwtToken.owner)
        .expect(200);
      expect(body.removed._id).toStrictEqual(vaccinationId['owner']);
    });

    test('Should not find a Vaccination after to be deleted  ', async () => {
      const { body } = await request(app)
        .get(
          `/api/v1/vaccination/${companyData.owner._id}/index/${vaccinationId['owner']}`
        )
        .set('jwt_token', jwtToken.owner)
        .expect(200);
      expect(body.data).toBeNull();
    });

    /*admin*/
    test('Should Create  a Vaccination for any company as an admin', async () => {
      const { body } = await request(app)
        .post(`/api/v1/vaccination/create`)
        .set('jwt_token', jwtToken.admin)
        .send({
          ...Builder.vaccination(),
          companyId: companyData.owner._id
        })
        .expect(200);
      vaccinationId['admin'] = body._id;

      expect(body._id.toString()).toBeDefined();
      expect(body.companyId.toString()).toEqual(
        companyData.owner._id.toString()
      );
      expect(body.createdAt.toString()).toBeDefined();
      expect(body.updatedAt.toString()).toBeDefined();
    });

    test('Should List All Vaccination for any company as an admin', async () => {
      const { body } = await request(app)
        .post(`/api/v1/vaccination/show`)
        .set('jwt_token', jwtToken.admin)
        .expect(200);

      expect(body.data.length).toBe(1);
    });

    test('Should Edit a Vaccination for any company as an admin', async () => {
      const { body } = await request(app)
        .put(`/api/v1/vaccination/update/${vaccinationId['admin']}`)
        .set('jwt_token', jwtToken.admin)
        .send({ lot: 'B-3' })
        .expect(200);

      expect(body.updated.lot).toBe('B-3');

      expect(body.updated.companyId._id.toString()).toEqual(
        companyData.owner._id.toString()
      );
    });

    test('Should Get One Vaccination  for any company as an admin', async () => {
      const { body } = await request(app)
        .get(`/api/v1/vaccination/index/${vaccinationId['admin']}`)
        .set('jwt_token', jwtToken.admin)
        .expect(200);

      expect(body.data._id.toString()).toBeDefined();
    });

    test('Should delete One Vaccination for any company as an admin', async () => {
      const { body } = await request(app)
        .delete(`/api/v1/vaccination/delete/${vaccinationId['admin']}`)
        .set('jwt_token', jwtToken.admin)
        .expect(200);
      expect(body.removed._id).toStrictEqual(vaccinationId['admin']);
    });

    test('Should not Get One Vaccination  for any company after to be deleted', async () => {
      const { body } = await request(app)
        .get(`/api/v1/vaccination/index/${vaccinationId['admin']}`)
        .set('jwt_token', jwtToken.admin)
        .expect(200);

      expect(body.data).toBeNull();
    });
  });
});
