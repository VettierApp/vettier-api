const request = require('supertest');
const mongoose = require('mongoose');
const { app, server } = require('../../index');
const { connect, closeDb } = require('../mockDB');
const { Builder } = require('../mockData');
const { createCompany, createUser, createPet } = require('../helpers');

let userData = {},
  jwtToken = {},
  companyData = {},
  followupsId = {},
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

describe('Followups Routes', () => {
  describe('Followups Routes attached to company id', () => {
    test('Should Create  a Followups as an owner', async () => {
      const { body } = await request(app)
        .post(`/api/v1/followups/${companyData.owner._id}/create`)
        .set('jwt_token', jwtToken.owner)
        .send({
          ...Builder.followups(),
          companyId: companyData.owner._id,
          petId: petData.client._id
        })
        .expect(200);
      followupsId['owner'] = body._id;

      expect(body._id.toString()).toStrictEqual(expect.anything());
      expect(body.companyId.toString()).toEqual(
        companyData.owner._id.toString()
      );
    });

    test('Should List All followups as an owner', async () => {
      const { body } = await request(app)
        .post(`/api/v1/followups/${companyData.owner._id}/show`)
        .set('jwt_token', jwtToken.owner)
        .expect(200);

      expect(body.data.length).toBe(1);
    });

    test('Should Edit a followups as an owner', async () => {
      const { body } = await request(app)
        .put(
          `/api/v1/followups/${companyData.owner._id}/update/${followupsId['owner']}`
        )
        .set('jwt_token', jwtToken.owner)
        .send({ comment: 'All is bahh' })
        .expect(200);

      expect(body.updated.comment).toBe('All is bahh');
      expect(body.updated.companyId._id.toString()).toEqual(
        companyData.owner._id.toString()
      );
    });

    test('Should Get One Followups as an owner', async () => {
      const { body } = await request(app)
        .get(
          `/api/v1/followups/${companyData.owner._id}/index/${followupsId['owner']}`
        )
        .set('jwt_token', jwtToken.owner)
        .expect(200);

      expect(body.data._id.toString()).toStrictEqual(expect.anything());
    });

    test('Should delete One Followups as an owner', async () => {
      const { body } = await request(app)
        .delete(
          `/api/v1/followups/${companyData.owner._id}/delete/${followupsId['owner']}`
        )
        .set('jwt_token', jwtToken.owner)
        .expect(200);
      expect(body.removed._id).toStrictEqual(followupsId['owner']);
    });

    test('Should not find a Followups after to be deleted  ', async () => {
      const { body } = await request(app)
        .get(
          `/api/v1/followups/${companyData.owner._id}/index/${followupsId['owner']}`
        )
        .set('jwt_token', jwtToken.owner)
        .expect(200);
      expect(body.data).toEqual(null);
    });

    /*admin*/
    test('Should Create  a Followups for any company as an admin', async () => {
      const { body } = await request(app)
        .post(`/api/v1/followups/create`)
        .set('jwt_token', jwtToken.admin)
        .send({
          ...Builder.followups(),
          companyId: companyData.owner._id,
          petId: petData.client._id
        })
        .expect(200);
      followupsId['admin'] = body._id;

      expect(body.companyId.toString()).toEqual(
        companyData.owner._id.toString()
      );
    });

    test('Should List All followups for any company as an admin', async () => {
      const { body } = await request(app)
        .post(`/api/v1/followups/show`)
        .set('jwt_token', jwtToken.admin)
        .expect(200);

      expect(body.data.length).toBe(1);
    });

    test('Should Edit a Followups for any company as an admin', async () => {
      const { body } = await request(app)
        .put(`/api/v1/followups/update/${followupsId['admin']}`)
        .set('jwt_token', jwtToken.admin)
        .send({ comment: 'All is bad' })
        .expect(200);

      expect(body.updated.comment).toBe('All is bad');

      expect(body.updated.companyId._id.toString()).toEqual(
        companyData.owner._id.toString()
      );
    });

    test('Should Get One Followups  for any company as an admin', async () => {
      const { body } = await request(app)
        .get(`/api/v1/followups/index/${followupsId['admin']}`)
        .set('jwt_token', jwtToken.admin)
        .expect(200);

      expect(body.data._id.toString()).toStrictEqual(expect.anything());
    });

    test('Should delete One FollowUps for any company as an admin', async () => {
      const { body } = await request(app)
        .delete(`/api/v1/followups/delete/${followupsId['admin']}`)
        .set('jwt_token', jwtToken.admin)
        .expect(200);
      expect(body.removed._id).toStrictEqual(followupsId['admin']);
    });

    test('Should not Get One Followups  for any company after to be deleted', async () => {
      const { body } = await request(app)
        .get(`/api/v1/followups/index/${followupsId['admin']}`)
        .set('jwt_token', jwtToken.admin)
        .expect(200);

      expect(body.data).toEqual(null);
    });
  });
});
