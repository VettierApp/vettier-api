const request = require('supertest');
const { app, server } = require('../../index');
const { connect, getUri, closeDb } = require('../mockDB');
const { Builder } = require('../mockData');
const { Role, User } = require('../../api/v1/models');
const { hashPassword } = require('../../api/v1/helpers/authentication');

let userId = {},
  jwtToken = {},
  mongoServer,
  adminUser;
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
});

afterAll(async () => {
  await closeDb();
  await server.close();
});

describe('Admin routes', () => {
  test('Should create a new user on DB and should respond a token', async () => {
    const response = await request(app)
      .post('/api/v1/user/signup')
      .send(Builder.user(3))
      .expect(200);
    userId['normalUser'] = response.body.user;
    expect(response.body.token).toBeDefined();
    expect(response.body.user).toBeDefined();
  });

  /* ADMINS  */
  test('Should sign in the admin to the app and return a token', async () => {
    const response = await request(app)
      .post('/api/v1/user/signin')
      .send(Builder.adminSignin())
      .expect(200);
    jwtToken['userAdmin'] = response.body.token;
    expect(response.body.token).toStrictEqual(expect.anything());
  });

  test('Should get All Users from admin account', async () => {
    const response = await request(app)
      .post('/api/v1/user/show')
      .set('jwt_token', jwtToken['userAdmin'])
      .expect(200);
  });

  test('Admin Should be able to edit users', async () => {
    const response = await request(app)
      .put(`/api/v1/user/admin/edit/${userId['normalUser']}`)
      .set('jwt_token', jwtToken['userAdmin'])
      .send({ firstName: 'other Name' })
      .expect(200);
  });

  // Test Find Users
  // Test Remove User
  // Test Deactivate User
  // Test Show All users Paginated
  // Test Join to the company
});
