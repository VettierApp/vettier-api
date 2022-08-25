const request = require('supertest');
const { app, server } = require('../../index');
const { connect, closeDb } = require('../mockDB');
const { Builder } = require('../mockData');
const { Role, User } = require('../../api/v1/models');
const { createCompany, createCompanyMembers } = require('../helpers');
const { hashPassword } = require('../../api/v1/helpers/authentication');

let userId = {},
  jwtToken = {},
  adminUser,
  companyId;
beforeAll(async () => {
  await connect();
  await Role.create({ roleName: 'client' });
  const adminRole = await Role.create({ roleName: 'admin' });
  const hashedPassword = await hashPassword(Builder.admin().password);
  const admin = await User.create({
    ...Builder.admin(),
    appRole: adminRole._id,
    password: hashedPassword
  });
  adminUser = admin;
  const { company, user, token } = await createCompany('owner');
  await createCompanyMembers('employee', company._id);
  companyId = company._id;
  jwtToken['owner'] = token;
});

afterAll(async () => {
  await closeDb();
  return server.close();
});

describe('User routes', () => {
  test('Should create a new user on DB and should respond a token', async () => {
    const response = await request(app)
      .post('/api/v1/user/signup')
      .send(Builder.user(1))
      .expect(200);
    jwtToken['firstActivation'] = response.body.token;
    userId['first'] = response.body.user;
    expect(response.body.token).toBeDefined();
    expect(response.body.user).toBeDefined();
  });

  test('Should create a new second one user on DB and should respond a token', async () => {
    const response = await request(app)
      .post('/api/v1/user/signup')
      .send(Builder.user(2))
      .expect(200);
    jwtToken['second'] = response.body.token;
    userId['second'] = response.body.user;
    expect(response.body.token).toBeDefined();
    expect(response.body.user).toBeDefined();
  });

  test("Shouldn't create a new user on DB with the same NPI field and should respond a bad request", async () => {
    const response = await request(app)
      .post('/api/v1/user/signup')
      .send(Builder.user(1))
      .expect(500);
  });

  test('Should activate the user and return Account Verified', async () => {
    const response = await request(app)
      .get('/api/v1/user/activation')
      .query({ token: jwtToken['firstActivation'] })
      .expect(200);
    expect(response.body.message).toMatch(/Account Verified/);
  });

  test("shouldn't create the same user with (email, npi), this fails with status code and not message", async () => {
    const response = await request(app)
      .post('/api/v1/user/signup')
      .send(Builder.user(1))
      .expect(500)
      .expect('Content-Type', 'application/json; charset=utf-8');

    expect(response.body.error).toMatchObject({
      message: 'AN INTERNAL ERROR HAVE OCCOUR'
    });
  });

  test('when create user one required fields is missing at least', async () => {
    const response = await request(app)
      .post('/api/v1/user/signup')
      .send(Builder.missingUser())
      .expect(500)
      .expect('Content-Type', 'application/json; charset=utf-8');
    expect(response.body.error).toMatchObject({
      message: 'AN INTERNAL ERROR HAVE OCCOUR'
    });
  });

  test('Should sign in the user to the app and return a token', async () => {
    const response = await request(app)
      .post('/api/v1/user/signin')
      .send(Builder.userSignIn())
      .expect(200);
    jwtToken['firstUser'] = response.body.token;
    expect(response.body.token).toBeDefined();
  });

  test('Should edit my Own Profile', async () => {
    const response = await request(app)
      .put(`/api/v1/user/edit/${userId['first']}`)
      .set('jwt_token', jwtToken['firstUser'])
      .send({ firstName: 'Anoher Name' })
      .expect(200);

    expect(response.body.updated.appRole._id).toBeDefined();
  });

  test('When user is changing the password, this does not match and the response is a Bad request', async () => {
    const newPassword = {
      ...Builder.wrongChangePassword()
    };
    const response = await request(app)
      .put(`/api/v1/user/password/${userId['first']}`)
      .set('jwt_token', jwtToken['firstUser'])
      .send(newPassword)
      .expect(400)
      .expect('Content-Type', 'application/json; charset=utf-8');
    expect(response.body.error).toHaveProperty(
      'message',
      'BAD REQUEST, TRY AGAIN'
    );
  });

  test('User is able to change his password and get code 202 and message Password Updated', async () => {
    const newPassword = {
      ...Builder.correctChangePassword()
    };
    const response = await request(app)
      .put(`/api/v1/user/password/${userId['first']}`)
      .set('jwt_token', jwtToken['firstUser'])
      .send(newPassword)
      .expect(202)
      .expect('Content-Type', 'application/json; charset=utf-8');
    expect(response.body.message).toMatch(/Password Updated/);
  });

  test('It has to check the token and return the user data', async () => {
    const response = await request(app)
      .get(`/api/v1/user/check-token`)
      .set('jwt_token', jwtToken['firstUser'])
      .expect(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('email');
  });

  test('Should get All users by Company', async () => {
    const { body } = await request(app)
      .post(`/api/v1/user/${companyId}/show`)
      .set('jwt_token', jwtToken['owner']);

    expect(body.data.length).toBe(3);
  });
});
