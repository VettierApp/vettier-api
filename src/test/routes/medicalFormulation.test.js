const request = require('supertest');
const mongoose = require('mongoose');
const { app, server } = require('../../index');
const { connect, closeDb } = require('../mockDB');
const { Builder } = require('../mockData');
const { createCompany, createUser, createPet } = require('../helpers');

let userData = {},
  jwtToken = {},
  companyData = {},
  assistanceId = {},
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

describe('Assistance Routes', () => {
  describe('Assistance Routes attached to company id', () => {
    test('Should Create  a Assistance as an owner', async () => {
      const { body } = await request(app)
        .post(`/api/v1/assistance/${companyData.owner._id}/create`)
        .set('jwt_token', jwtToken.owner)
        .send({
          ...Builder.medicalAssistance(),
          companyId: companyData.owner._id,
          petId: petData.client._id
        })
        .expect(200);

      assistanceId['owner'] = body._id;

      expect(body._id.toString()).toBeDefined();
      expect(body.companyId.toString()).toEqual(
        companyData.owner._id.toString()
      );
      expect(body.petId.toString()).toEqual(petData.client._id.toString());
      expect(body.createdAt.toString()).toBeDefined();
      expect(body.updatedAt.toString()).toBeDefined();
    });

    test('Should List All Assistance as an owner', async () => {
      const { body } = await request(app)
        .post(`/api/v1/assistance/${companyData.owner._id}/show`)
        .set('jwt_token', jwtToken.owner)
        .expect(200);

      expect(body.data.length).toBe(1);
    });

    test('Should Edit a Assistance as an owner', async () => {
      const { body } = await request(app)
        .put(
          `/api/v1/assistance/${companyData.owner._id}/update/${assistanceId['owner']}`
        )
        .set('jwt_token', jwtToken.owner)
        .send({ details: 'detail 2' })
        .expect(200);

      expect(body.updated.details).toBe('detail 2');
      expect(body.updated.companyId._id.toString()).toEqual(
        companyData.owner._id.toString()
      );
      expect(body.updated.petId._id.toString()).toEqual(
        petData.client._id.toString()
      );
    });

    test('Should Get One Assistance as an owner', async () => {
      const { body } = await request(app)
        .get(
          `/api/v1/assistance/${companyData.owner._id}/index/${assistanceId['owner']}`
        )
        .set('jwt_token', jwtToken.owner)
        .expect(200);

      expect(body.data._id.toString()).toBeDefined();
    });

    test('Should delete One Assistance as an owner', async () => {
      const { body } = await request(app)
        .delete(
          `/api/v1/assistance/${companyData.owner._id}/delete/${assistanceId['owner']}`
        )
        .set('jwt_token', jwtToken.owner)
        .expect(200);
      expect(body.removed._id).toStrictEqual(assistanceId['owner']);
    });

    test('Should not find a Assistance after to be deleted  ', async () => {
      const { body } = await request(app)
        .get(
          `/api/v1/assistance/${companyData.owner._id}/index/${assistanceId['owner']}`
        )
        .set('jwt_token', jwtToken.owner)
        .expect(200);
      expect(body.data).toBeNull();
    });

    /*admin*/
    test('Should Create  a Assistance for any company as an admin', async () => {
      const { body } = await request(app)
        .post(`/api/v1/assistance/create`)
        .set('jwt_token', jwtToken.admin)
        .send({
          ...Builder.medicalAssistance(),
          companyId: companyData.owner._id,
          petId: petData.client._id
        })
        .expect(200);
      assistanceId['admin'] = body._id;

      expect(body._id.toString()).toBeDefined();
      expect(body.companyId.toString()).toEqual(
        companyData.owner._id.toString()
      );
      expect(body.petId.toString()).toEqual(petData.client._id.toString());
      expect(body.createdAt.toString()).toBeDefined();
      expect(body.updatedAt.toString()).toBeDefined();
    });

    test('Should List All Assistance for any company as an admin', async () => {
      const { body } = await request(app)
        .post(`/api/v1/assistance/show`)
        .set('jwt_token', jwtToken.admin)
        .expect(200);

      expect(body.data.length).toBe(1);
    });

    test('Should Edit a Assistance for any company as an admin', async () => {
      const { body } = await request(app)
        .put(`/api/v1/assistance/update/${assistanceId['admin']}`)
        .set('jwt_token', jwtToken.admin)
        .send({ motive: 'motive ss' })
        .expect(200);

      expect(body.updated.motive).toBe('motive ss');

      expect(body.updated.companyId._id.toString()).toEqual(
        companyData.owner._id.toString()
      );

      expect(body.updated.petId._id.toString()).toEqual(
        petData.client._id.toString()
      );
    });

    test('Should Get One Assistance  for any company as an admin', async () => {
      const { body } = await request(app)
        .get(`/api/v1/assistance/index/${assistanceId['admin']}`)
        .set('jwt_token', jwtToken.admin)
        .expect(200);

      expect(body.data._id.toString()).toBeDefined();
    });

    test('Should delete One Assistance for any company as an admin', async () => {
      const { body } = await request(app)
        .delete(`/api/v1/assistance/delete/${assistanceId['admin']}`)
        .set('jwt_token', jwtToken.admin)
        .expect(200);
      expect(body.removed._id).toStrictEqual(assistanceId['admin']);
    });

    test('Should not Get One Assistance  for any company after to be deleted', async () => {
      const { body } = await request(app)
        .get(`/api/v1/assistance/index/${assistanceId['admin']}`)
        .set('jwt_token', jwtToken.admin)
        .expect(200);

      expect(body.data).toBeNull();
    });
  });
});
