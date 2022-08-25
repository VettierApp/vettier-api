const request = require('supertest');
const mongoose = require('mongoose');
const { app, server } = require('../../index');
const { connect, closeDb } = require('../mockDB');
const { Builder } = require('../mockData');
const { createCompany, createUser } = require('../helpers');

let userData = {},
  jwtToken = {},
  companyData = {},
  facilityId = {};

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

describe('Facility Routes', () => {
  describe('Facility Routes attached to company id', () => {
    test('Should Create  a Facility as an owner', async () => {
      const { body } = await request(app)
        .post(`/api/v1/facility/${companyData.owner._id}/create`)
        .set('jwt_token', jwtToken.owner)
        .send({
          ...Builder.facility(),
          companyId: companyData.owner._id
        })
        .expect(200);
      facilityId['owner'] = body._id;

      expect(body._id.toString()).toBeDefined();
      expect(body.companyId.toString()).toEqual(
        companyData.owner._id.toString()
      );
    });

    test('Should List All facilities as an owner', async () => {
      const { body } = await request(app)
        .post(`/api/v1/facility/${companyData.owner._id}/show`)
        .set('jwt_token', jwtToken.owner)
        .expect(200);

      expect(body.data.length).toBe(1);
    });

    test('Should Edit a facility as an owner', async () => {
      const { body } = await request(app)
        .put(
          `/api/v1/facility/${companyData.owner._id}/update/${facilityId['owner']}`
        )
        .set('jwt_token', jwtToken.owner)
        .send({ phone: '30123232323' })
        .expect(200);

      expect(body.updated.phone).toBe('30123232323');
      expect(body.updated.companyId._id.toString()).toEqual(
        companyData.owner._id.toString()
      );
    });

    test('Should Get One Facility as an owner', async () => {
      const { body } = await request(app)
        .get(
          `/api/v1/facility/${companyData.owner._id}/index/${facilityId['owner']}`
        )
        .set('jwt_token', jwtToken.owner)
        .expect(200);

      expect(body.data._id.toString()).toStrictEqual(expect.anything());
    });

    test('Should delete One Facility as an owner', async () => {
      const { body } = await request(app)
        .delete(
          `/api/v1/facility/${companyData.owner._id}/delete/${facilityId['owner']}`
        )
        .set('jwt_token', jwtToken.owner)
        .expect(200);
      expect(body.removed._id).toStrictEqual(facilityId['owner']);
    });

    test('Should not find a facility after to be deleted  ', async () => {
      const { body } = await request(app)
        .get(
          `/api/v1/facility/${companyData.owner._id}/index/${facilityId['owner']}`
        )
        .set('jwt_token', jwtToken.owner)
        .expect(200);
      expect(body.data).toEqual(null);
    });

    /*admin*/
    test('Should Create  a Facility for any company as an admin', async () => {
      const { body } = await request(app)
        .post(`/api/v1/facility/create`)
        .set('jwt_token', jwtToken.admin)
        .send({
          ...Builder.facility(),
          companyId: companyData.owner._id
        })
        .expect(200);
      facilityId['admin'] = body._id;

      expect(body.companyId.toString()).toEqual(
        companyData.owner._id.toString()
      );
    });

    test('Should List All facilities for any company as an admin', async () => {
      const { body } = await request(app)
        .post(`/api/v1/facility/show`)
        .set('jwt_token', jwtToken.admin)
        .expect(200);

      expect(body.data.length).toBe(1);
    });

    test('Should Edit a facility for any company as an admin', async () => {
      const { body } = await request(app)
        .put(`/api/v1/facility/update/${facilityId['admin']}`)
        .set('jwt_token', jwtToken.admin)
        .send({ phone: '333222111' })
        .expect(200);

      expect(body.updated.phone).toBe('333222111');

      expect(body.updated.companyId._id.toString()).toEqual(
        companyData.owner._id.toString()
      );
    });

    test('Should Get One Facility  for any company as an admin', async () => {
      const { body } = await request(app)
        .get(`/api/v1/facility/index/${facilityId['admin']}`)
        .set('jwt_token', jwtToken.admin)
        .expect(200);

      expect(body.data._id.toString()).toStrictEqual(expect.anything());
    });

    test('Should delete One Facility for any company as an admin', async () => {
      const { body } = await request(app)
        .delete(`/api/v1/facility/delete/${facilityId['admin']}`)
        .set('jwt_token', jwtToken.admin)
        .expect(200);
      expect(body.removed._id).toStrictEqual(facilityId['admin']);
    });

    test('Should not Get One Facility  for any company after to be deleted', async () => {
      const { body } = await request(app)
        .get(`/api/v1/facility/index/${facilityId['admin']}`)
        .set('jwt_token', jwtToken.admin)
        .expect(200);

      expect(body.data).toEqual(null);
    });
  });
});
