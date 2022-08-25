const request = require('supertest');
const mongoose = require('mongoose');
const { app, server } = require('../../index');
const { connect, closeDb } = require('../mockDB');
const { Builder } = require('../mockData');
const {
  createCompany,
  createUser,
  createPet,
  createFacility
} = require('../helpers');

let userData = {},
  jwtToken = {},
  companyData = {},
  requestId = {},
  petData = {},
  facilityData = {};
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
  const { facility } = await createFacility(company._id);
  facilityData = facility;
});

afterAll(async () => {
  await closeDb();
  return server.close();
});

describe('Request Routes', () => {
  describe('Request Routes attached to company id', () => {
    test('Should Create  a Request as an owner', async () => {
      const { body, headers } = await request(app)
        .post(`/api/v1/request/${companyData.owner._id}/create`)
        .set('jwt_token', jwtToken.owner)
        .send({
          ...Builder.request(),
          companyId: companyData.owner._id,
          userId: userData.owner._id,
          petId: petData.client._id,
          facility: facilityData._id
        })
        .expect(200);
      requestId['owner'] = body._id;

      expect(body._id.toString()).toStrictEqual(expect.anything());
      expect(body.companyId.toString()).toEqual(
        companyData.owner._id.toString()
      );
      expect(body.userId.toString()).toEqual(userData.owner._id.toString());
      expect(body.petId.toString()).toEqual(petData.client._id.toString());
      expect(body.facility.toString()).toEqual(facilityData._id.toString());
    });

    test('Should List All requestes as an owner', async () => {
      const { body } = await request(app)
        .post(`/api/v1/request/${companyData.owner._id}/show`)
        .set('jwt_token', jwtToken.owner)
        .expect(200);

      expect(body.data.length).toBe(1);
    });

    test('Should Edit a request as an owner', async () => {
      const { body } = await request(app)
        .put(
          `/api/v1/request/${companyData.owner._id}/update/${requestId['owner']}`
        )
        .set('jwt_token', jwtToken.owner)
        .send({ requestDate: '2020-01-03' })
        .expect(200);

      expect(body.updated.requestDate).toBe('2020-01-03T00:00:00.000Z');
      expect(body.updated.companyId._id.toString()).toEqual(
        companyData.owner._id.toString()
      );
      expect(body.updated.userId._id.toString()).toEqual(
        userData.owner._id.toString()
      );
      expect(body.updated.petId._id.toString()).toEqual(
        petData.client._id.toString()
      );
      expect(body.updated.facility._id.toString()).toEqual(
        facilityData._id.toString()
      );
    });

    test('Should Get One Request as an owner', async () => {
      const { body } = await request(app)
        .get(
          `/api/v1/request/${companyData.owner._id}/index/${requestId['owner']}`
        )
        .set('jwt_token', jwtToken.owner)
        .expect(200);

      expect(body.data._id.toString()).toStrictEqual(expect.anything());
    });

    test('Should delete One Request as an owner', async () => {
      const { body } = await request(app)
        .delete(
          `/api/v1/request/${companyData.owner._id}/delete/${requestId['owner']}`
        )
        .set('jwt_token', jwtToken.owner)
        .expect(200);
      expect(body.removed._id).toStrictEqual(requestId['owner']);
    });

    test('Should not find a request after to be deleted  ', async () => {
      const { body } = await request(app)
        .get(
          `/api/v1/request/${companyData.owner._id}/index/${requestId['owner']}`
        )
        .set('jwt_token', jwtToken.owner)
        .expect(200);
      expect(body.data).toEqual(null);
    });

    /*admin*/
    test('Should Create  a Request for any company as an admin', async () => {
      const { body } = await request(app)
        .post(`/api/v1/request/create`)
        .set('jwt_token', jwtToken.admin)
        .send({
          ...Builder.request(),
          companyId: companyData.owner._id,
          userId: userData.owner._id,
          petId: petData.client._id,
          facility: facilityData._id
        })
        .expect(200);
      requestId['owner'] = body._id;

      expect(body.companyId.toString()).toEqual(
        companyData.owner._id.toString()
      );
      expect(body.userId.toString()).toEqual(userData.owner._id.toString());
      expect(body.petId.toString()).toEqual(petData.client._id.toString());
      expect(body.facility.toString()).toEqual(facilityData._id.toString());
    });

    test('Should List All requestes for any company as an admin', async () => {
      const { body } = await request(app)
        .post(`/api/v1/request/show`)
        .set('jwt_token', jwtToken.admin)
        .expect(200);

      expect(body.data.length).toBe(1);
    });

    test('Should Edit a request for any company as an admin', async () => {
      const { body } = await request(app)
        .put(`/api/v1/request/update/${requestId['owner']}`)
        .set('jwt_token', jwtToken.admin)
        .send({ requestDate: '2020-01-04' })
        .expect(200);

      expect(body.updated.requestDate).toBe('2020-01-04T00:00:00.000Z');

      expect(body.updated.companyId._id.toString()).toEqual(
        companyData.owner._id.toString()
      );
      expect(body.updated.userId._id.toString()).toEqual(
        userData.owner._id.toString()
      );
      expect(body.updated.petId._id.toString()).toEqual(
        petData.client._id.toString()
      );
      expect(body.updated.facility._id.toString()).toEqual(
        facilityData._id.toString()
      );
    });

    test('Should Get One Request  for any company as an admin', async () => {
      const { body } = await request(app)
        .get(`/api/v1/request/index/${requestId['owner']}`)
        .set('jwt_token', jwtToken.admin)
        .expect(200);

      expect(body.data._id.toString()).toStrictEqual(expect.anything());
    });

    test('Should delete One Request for any company as an admin', async () => {
      const { body } = await request(app)
        .delete(`/api/v1/request/delete/${requestId['owner']}`)
        .set('jwt_token', jwtToken.admin)
        .expect(200);
      expect(body.removed._id).toStrictEqual(requestId['owner']);
    });

    test('Should not Get One Request  for any company after to be deleted', async () => {
      const { body } = await request(app)
        .get(`/api/v1/request/index/${requestId['owner']}`)
        .set('jwt_token', jwtToken.admin)
        .expect(200);

      expect(body.data).toEqual(null);
    });
  });
});
