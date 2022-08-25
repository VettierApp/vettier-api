const request = require('supertest');
const mongoose = require('mongoose');
const { app, server } = require('../../index');
const { connect, closeDb } = require('../mockDB');
const { Builder } = require('../mockData');
const { createCompany } = require('../helpers');

let userData = {},
  jwtToken = {},
  companyData = {},
  createdRoleId,
  numberRolesCreated = 2;
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

describe('Role routes', () => {
  describe('Role endpoints attached to company id', () => {
    test('As owner of a company should be able to create roles and assign it to my employees', async () => {
      const { body } = await request(app)
        .post(`/api/v1/role/${companyData.admin._id}/create`)
        .send(Builder.createGlobalRoles('physician'))
        .set('jwt_token', jwtToken.admin)
        .expect(200);

      numberRolesCreated += 1;
      createdRoleId = body._id;
      expect(body.companyId.toString()).toEqual(
        companyData.admin._id.toString()
      );
      expect(body.roleName).toBe('physician');
    });

    test('As owner of a company should be able to see the roles created', async () => {
      const response = await request(app)
        .post(`/api/v1/role/${companyData.admin._id}/show`)
        .set('jwt_token', jwtToken.admin)
        .expect(200);
    });

    test('As owner of a company should be able to edit a specific role, searching it by Id', async () => {
      const { body } = await request(app)
        .put(`/api/v1/role/${companyData.admin._id}/edit/${createdRoleId}`)
        .send({ permissionLevel: ['read', 'write'] })
        .set('jwt_token', jwtToken.admin)
        .expect(200);
      expect(body.permissionLevel).toEqual(['read', 'write']);
    });

    test('As owner of a company should be able to see the details of a specific role', async () => {
      const { body } = await request(app)
        .get(`/api/v1/role/${companyData.admin._id}/index/${createdRoleId}`)
        .set('jwt_token', jwtToken.admin)
        .expect(200);
      expect(body._id.toString()).toBe(createdRoleId.toString());
    });

    test('As owner of a company should be able to deactivate a role', async () => {
      const { body } = await request(app)
        .put(
          `/api/v1/role/${companyData.admin._id}/deactivate/${createdRoleId}`
        )
        .send({ status: false })
        .set('jwt_token', jwtToken.admin)
        .expect(200);
      expect(body._id.toString()).toBe(createdRoleId.toString());
      expect(body.status).toBe(false);
    });
  });

  describe('Role endpoints for admins', () => {
    test('As admin global role should create a role for a specific company or global', async () => {
      const { body } = await request(app)
        .post(`/api/v1/role/create`)
        .send({ ...Builder.createGlobalRoles('auxiliar') })
        .set('jwt_token', jwtToken.admin)
        .expect(200);
      numberRolesCreated++;
      expect(body.roleName).toBe('auxiliar');
    });
    test('As admin global role should see all the roles in the app for every company', async () => {
      const { body } = await request(app)
        .post(`/api/v1/role/show`)
        .set('jwt_token', jwtToken.admin)
        .expect(200);
      expect(body.data.length).toBe(numberRolesCreated);
    });

    test('As admin global role should see all the roles in the app for every company', async () => {
      const { body } = await request(app)
        .post(`/api/v1/role/show`)
        .set('jwt_token', jwtToken.admin)
        .expect(200);
      expect(body.data.length).toBe(numberRolesCreated);
    });

    test('As admin global role should see a specific the role in the app for every company', async () => {
      const { body } = await request(app)
        .get(`/api/v1/role/index/${createdRoleId}`)
        .set('jwt_token', jwtToken.admin)
        .expect(200);
      expect(body.data._id.toString()).toBe(createdRoleId);
    });

    test('As admin global role should be able to edit any role of the app', async () => {
      const { body } = await request(app)
        .put(`/api/v1/role/edit/${createdRoleId}`)
        .send({ status: true })
        .set('jwt_token', jwtToken.admin)
        .expect(200);
      expect(body.updated._id.toString()).toBe(createdRoleId);
      expect(body.updated.status).toBe(true);
    });
  });
});
