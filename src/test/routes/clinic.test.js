const request = require('supertest');
const mongoose = require('mongoose');
const { app, server } = require('../../index');
const { connect, closeDb } = require('../mockDB');
const { Builder } = require('../mockData');
const {
  createCompany,
  createUser,
  createPet,
  createFollowUps
} = require('../helpers');

let userData = {},
  jwtToken = {},
  companyData = {},
  clinicId = {},
  petData = {},
  followUpsData = {};
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
  const { followups: followups } = await createFollowUps(
    company._id,
    petClient._id,
    'All is good'
  );
  followUpsData['client'] = followups;
});

afterAll(async () => {
  await closeDb();
  return server.close();
});

describe('Clinic Routes', () => {
  describe('Clinic Routes attached to company id', () => {
    test('Should Create  a Clinic as an owner', async () => {
      const { body } = await request(app)
        .post(`/api/v1/clinic/${companyData.owner._id}/create`)
        .set('jwt_token', jwtToken.owner)
        .send({
          companyId: companyData.owner._id,
          petId: petData.client._id,
          record_type: 'followups',
          record_id: followUpsData.client._id
        })
        .expect(200);
      console.log(body);
      clinicId['owner'] = body._id;

      expect(body._id.toString()).toStrictEqual(expect.anything());
      expect(body.companyId.toString()).toEqual(
        companyData.owner._id.toString()
      );
      expect(body.petId.toString()).toEqual(petData.client._id.toString());
    });

    test('Should List All Clinics as an owner', async () => {
      const { body } = await request(app)
        .post(`/api/v1/clinic/${companyData.owner._id}/show`)
        .set('jwt_token', jwtToken.owner)
        .expect(200);

      expect(body.data.length).toBe(1);
    });

    test('Should Edit a Clinic as an owner', async () => {
      const { body } = await request(app)
        .put(
          `/api/v1/clinic/${companyData.owner._id}/update/${clinicId['owner']}`
        )
        .set('jwt_token', jwtToken.owner)
        .expect(200);

      expect(body.updated.companyId._id.toString()).toEqual(
        companyData.owner._id.toString()
      );
      expect(body.updated.petId._id.toString()).toEqual(
        petData.client._id.toString()
      );
    });

    test('Should Get One Clinic as an owner', async () => {
      const { body } = await request(app)
        .get(
          `/api/v1/clinic/${companyData.owner._id}/index/${clinicId['owner']}`
        )
        .set('jwt_token', jwtToken.owner)
        .expect(200);
      expect(body.data._id.toString()).toStrictEqual(expect.anything());
    });

    test('Should delete One Clinic as an owner', async () => {
      const { body } = await request(app)
        .delete(
          `/api/v1/clinic/${companyData.owner._id}/delete/${clinicId['owner']}`
        )
        .set('jwt_token', jwtToken.owner)
        .expect(200);
      expect(body.removed._id).toStrictEqual(clinicId['owner']);
    });

    test('Should not Get One Clinic after to be deleted (owner)', async () => {
      const { body } = await request(app)
        .get(
          `/api/v1/clinic/${companyData.owner._id}/index/${clinicId['owner']}`
        )
        .set('jwt_token', jwtToken.owner)
        .expect(200);

      expect(body.data).toEqual(null);
    });

    /*admin*/
    test('Should Create  a Clinic for any company as an admin', async () => {
      const { body } = await request(app)
        .post(`/api/v1/clinic/create`)
        .set('jwt_token', jwtToken.admin)
        .send({
          companyId: companyData.owner._id,
          petId: petData.client._id,
          record_type: 'followups',
          record_id: followUpsData.client._id
        })
        .expect(200);
      clinicId['owner'] = body._id;

      expect(body._id.toString()).toStrictEqual(expect.anything());
      expect(body.companyId.toString()).toEqual(
        companyData.owner._id.toString()
      );
      expect(body.petId.toString()).toEqual(petData.client._id.toString());
    });

    test('Should List All Clinics for any company as an admin', async () => {
      const { body } = await request(app)
        .post(`/api/v1/clinic/show`)
        .set('jwt_token', jwtToken.admin)
        .expect(200);

      expect(body.data.length).toBe(1);
    });

    test('Should Edit a Clinics for any company as an admin', async () => {
      const { body } = await request(app)
        .put(`/api/v1/clinic/update/${clinicId['owner']}`)
        .set('jwt_token', jwtToken.admin)
        .expect(200);

      expect(body.updated.companyId._id.toString()).toEqual(
        companyData.owner._id.toString()
      );
      expect(body.updated.petId._id.toString()).toEqual(
        petData.client._id.toString()
      );
    });

    test('Should Get One Clinics  for any company as an admin', async () => {
      const { body } = await request(app)
        .get(`/api/v1/clinic/index/${clinicId['owner']}`)
        .set('jwt_token', jwtToken.admin)
        .expect(200);

      expect(body.data._id.toString()).toStrictEqual(expect.anything());
    });

    test('Should delete One Clinics for any company as an admin', async () => {
      const { body } = await request(app)
        .delete(`/api/v1/clinic/delete/${clinicId['owner']}`)
        .set('jwt_token', jwtToken.admin)
        .expect(200);

      expect(body.removed._id).toStrictEqual(clinicId['owner']);
    });

    test('Should not Get One Clinics  after be deleted (admin)', async () => {
      const { body } = await request(app)
        .get(`/api/v1/clinic/index/${clinicId['owner']}`)
        .set('jwt_token', jwtToken.admin)
        .expect(200);

      expect(body.data).toEqual(null);
    });
  });
});
