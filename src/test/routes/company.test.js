const request = require('supertest');
const mongoose = require('mongoose');
const { app, server } = require('../../index');
const { connect, closeDb } = require('../mockDB');
const { Builder } = require('../mockData');
const { createUser, createRole } = require('../helpers');

let userData = {},
  jwtToken = {},
  company;
beforeAll(async () => {
  await connect();
  const { user: ownerUser, token: ownerToken } = await createUser('owner');
  const { user: adminUser, token: adminToken } = await createUser('admin');
  const { user: clientUser, token: clientToken } = await createUser('client');
  await createRole('employee');
  userData['owner'] = { ...ownerUser };
  jwtToken['owner'] = ownerToken;
  userData['admin'] = { ...adminUser };
  jwtToken['admin'] = adminToken;
  userData['client'] = clientUser;
  jwtToken['client'] = clientToken;
});

afterAll(async () => {
  await closeDb();
  return server.close();
});

describe('Company routes', () => {
  describe('Company routes for users', () => {
    test('should create a company with the user and assign a owner role to the entrepreneur', async () => {
      const response = await request(app)
        .post('/api/v1/company/create')
        .send(Builder.newCompany())
        .set('jwt_token', jwtToken.owner)
        .expect(200);
      company = response.body;
      expect(response.body).toMatchObject({
        status: true,
        ownerId: expect.any(String)
      });
      expect(response.body.ownerId.toString()).toEqual(
        userData.owner._doc._id.toString()
      );
    });

    test('company director`s roles should change appRole as owner and companyRole as director', async () => {
      const { body } = await request(app)
        .get(`/api/v1/user/index/${userData.owner._doc._id}`)
        .set('jwt_token', jwtToken.owner)
        .expect(200);
      console.log(body.data);
      expect(body.data.appRole.roleName).toEqual('Propietario');
      expect(body.data.companyRole.roleName).toEqual('Director');
    });

    test('company user is allowed to update his information data as long as the company status be active or premium', async () => {
      const { body } = await request(app)
        .put(`/api/v1/company/${company._id}/edit`)
        .send({ name: 'Pet Perez Company' })
        .set('jwt_token', jwtToken.owner)
        .expect(200);
      expect(body.email).toMatch(company.email);
      expect(body.idNumber).toEqual(company.idNumber);
    });

    test("user isn't allowed to change the email or npi throught the edit endpoint", async () => {
      const { body } = await request(app)
        .put(`/api/v1/company/${company._id}/edit`)
        .send({ email: 'mynewemail@gmail.com', idNumber: 987654321 })
        .set('jwt_token', jwtToken.owner)
        .expect(400);
    });

    test('company owner is able to invite new persons to the conpany', async () => {
      const { body } = await request(app)
        .post(`/api/v1/user/${company._id}/invite`)
        .set('jwt_token', jwtToken.owner)
        .send({ userId: userData['client']._id })
        .expect(200);
      jwtToken['userCompany'] = body.token;
    });

    test('Should accept the invitation to join in company', async () => {
      const { body } = await request(app)
        .get(
          `/api/v1/user/${company._id}/link?token=${jwtToken['userCompany']}`
        )
        .expect(200);
    });
  });

  describe('Company routes for support and admins permissions', () => {
    test('As admin and support users can see the list of companies for the app', async () => {
      const response = await request(app)
        .post('/api/v1/company/show')
        .set('jwt_token', jwtToken.admin)
        .expect(200);
    });

    test('As admin or support are allowed to search for a specific company id, an it must return the same id as the param searched', async () => {
      const { body } = await request(app)
        .get(`/api/v1/company/index/${company._id}`)
        .set('jwt_token', jwtToken.admin)
        .expect(200);
      expect(body.data._id).toBe(company._id);
    });

    test('As admin or support are allowed to edit the information for a company id', async () => {
      const address = 'Avenue 24th, #40 - 100 Grand Tower Floor 21th';
      const { body } = await request(app)
        .put(`/api/v1/company/edit/${company._id}`)
        .send({ address })
        .set('jwt_token', jwtToken.admin)
        .expect(200);
      expect(body).toHaveProperty('updated');
      expect(body.updated.address).toBe(address);
    });

    test("As support isn't allowed to edit sensitive (status, premiumDate, premiumValue) information for a company id", async () => {
      const newData = {
        premiumDate: new Date(),
        status: 'deactivate',
        premiumValue: 1000000
      };
      const response = await request(app)
        .put(`/api/v1/company/edit/${company._id}`)
        .send(newData)
        .set('jwt_token', jwtToken.admin)
        .expect(400);
    });

    test.skip('As admin should modify the status of a company in order to deactivate or active it as a premium one', async () => {
      const response = await request(app)
        .put(`/api/v1/company/deactivate/${company._id}`)
        .send({ status: 'premium' })
        .set('jwt_token', jwtToken.admin)
        .expect(200);
    });

    test('As admin and API gateway can edit sensitive information as premiumDate or premiumValue of a company', async () => {
      const newData = {
        premiumDate: new Date(),
        premiumValue: 1000000
      };
      const response = await request(app)
        .put(`/api/v1/company/premium/${company._id}`)
        .send(newData)
        .set('jwt_token', jwtToken.admin)
        .expect(200);
    });
  });
});
