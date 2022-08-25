const request = require('supertest');
const mongoose = require('mongoose');
const { app, server } = require('../../index');
const { connect, closeDb } = require('../mockDB');
const { Builder } = require('../mockData');
const { createCompany, createUser, createPet } = require('../helpers');

let userData = {},
  jwtToken = {},
  companyData = {},
  formulationId = {},
  petData = {};

beforeAll(async () => {
  await connect();
  const { company, user, token } = await createCompany('owner');
  userData['owner'] = { ...user };
  jwtToken['owner'] = token;
  companyData['owner'] = { ...company };
  const { user: adminUser, token: adminToken } = await createUser('admin');
  userData['admin'] = adminUser;
  jwtToken['admin'] = adminToken;
  const { pet: petClient } = await createPet(company._id, user._id);
  petData['client'] = petClient;
});

afterAll(async () => {
  await closeDb();
  return server.close();
});

describe('Formulation Routes', () => {
  describe('Formulation Routes attached to company id', () => {
    test('Should Create  a Formulation as an owner', async () => {
      const { body } = await request(app)
        .post(`/api/v1/formulation/${companyData.owner._id}/create`)
        .set('jwt_token', jwtToken.owner)
        .send({
          ...Builder.formulation(),
          companyId: companyData.owner._id,
          petId: petData.client._id
        })
        .expect(200);

      formulationId['owner'] = body._id;

      expect(body._id.toString()).toBeDefined();
      expect(body.companyId.toString()).toEqual(
        companyData.owner._id.toString()
      );
      expect(body.petId.toString()).toEqual(petData.client._id.toString());
      expect(body.createdAt.toString()).toBeDefined();
      expect(body.updatedAt.toString()).toBeDefined();
    });

    test('Should List All Formulation as an owner', async () => {
      const { body } = await request(app)
        .post(`/api/v1/formulation/${companyData.owner._id}/show`)
        .set('jwt_token', jwtToken.owner)
        .expect(200);

      expect(body.data.length).toBe(1);
    });

    test('Should Edit a Formulation as an owner', async () => {
      const { body } = await request(app)
        .put(
          `/api/v1/formulation/${companyData.owner._id}/update/${formulationId['owner']}`
        )
        .set('jwt_token', jwtToken.owner)
        .send({ diagnosis: 'diagnosis 2' })
        .expect(200);

      expect(body.updated.diagnosis).toBe('diagnosis 2');
      expect(body.updated.companyId._id.toString()).toEqual(
        companyData.owner._id.toString()
      );
      expect(body.updated.petId._id.toString()).toEqual(
        petData.client._id.toString()
      );
    });

    test('Should Get One Formulation as an owner', async () => {
      const { body } = await request(app)
        .get(
          `/api/v1/formulation/${companyData.owner._id}/index/${formulationId['owner']}`
        )
        .set('jwt_token', jwtToken.owner)
        .expect(200);

      expect(body.data._id.toString()).toBeDefined();
    });

    test('Should delete One Formulation as an owner', async () => {
      const { body } = await request(app)
        .delete(
          `/api/v1/formulation/${companyData.owner._id}/delete/${formulationId['owner']}`
        )
        .set('jwt_token', jwtToken.owner)
        .expect(200);
      expect(body.removed._id).toStrictEqual(formulationId['owner']);
    });

    test('Should not find a Formulation after to be deleted  ', async () => {
      const { body } = await request(app)
        .get(
          `/api/v1/formulation/${companyData.owner._id}/index/${formulationId['owner']}`
        )
        .set('jwt_token', jwtToken.owner)
        .expect(200);
      expect(body.data).toBeNull();
    });

    /*admin*/
    test('Should Create  a Formulation for any company as an admin', async () => {
      const { body } = await request(app)
        .post(`/api/v1/formulation/create`)
        .set('jwt_token', jwtToken.admin)
        .send({
          ...Builder.medicalAssistance(),
          companyId: companyData.owner._id,
          petId: petData.client._id
        })
        .expect(200);
      formulationId['admin'] = body._id;

      expect(body._id.toString()).toBeDefined();
      expect(body.companyId.toString()).toEqual(
        companyData.owner._id.toString()
      );
      expect(body.petId.toString()).toEqual(petData.client._id.toString());
      expect(body.createdAt.toString()).toBeDefined();
      expect(body.updatedAt.toString()).toBeDefined();
    });

    test('Should List All Formulation for any company as an admin', async () => {
      const { body } = await request(app)
        .post(`/api/v1/formulation/show`)
        .set('jwt_token', jwtToken.admin)
        .expect(200);

      expect(body.data.length).toBe(1);
    });

    test('Should Edit a Formulation for any company as an admin', async () => {
      const { body } = await request(app)
        .put(`/api/v1/formulation/update/${formulationId['admin']}`)
        .set('jwt_token', jwtToken.admin)
        .send({ medicines: 'medicines ss' })
        .expect(200);

      expect(body.updated.medicines).toBe('medicines ss');

      expect(body.updated.companyId._id.toString()).toEqual(
        companyData.owner._id.toString()
      );

      expect(body.updated.petId._id.toString()).toEqual(
        petData.client._id.toString()
      );
    });

    test('Should Get One Formulation  for any company as an admin', async () => {
      const { body } = await request(app)
        .get(`/api/v1/formulation/index/${formulationId['admin']}`)
        .set('jwt_token', jwtToken.admin)
        .expect(200);

      expect(body.data._id.toString()).toBeDefined();
    });

    test('Should delete One Formulation for any company as an admin', async () => {
      const { body } = await request(app)
        .delete(`/api/v1/formulation/delete/${formulationId['admin']}`)
        .set('jwt_token', jwtToken.admin)
        .expect(200);
      expect(body.removed._id).toStrictEqual(formulationId['admin']);
    });

    test('Should not Get One Formulation  for any company after to be deleted', async () => {
      const { body } = await request(app)
        .get(`/api/v1/formulation/index/${formulationId['admin']}`)
        .set('jwt_token', jwtToken.admin)
        .expect(200);

      expect(body.data).toBeNull();
    });
  });
});
