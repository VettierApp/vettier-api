const generatePassword = require('generate-password');
const BaseController = require('./base.controller');
const { sendError } = require('../helpers');
const { User, Company, Role } = require('../services');
const {
  hashPassword,
  jwtSigninToken,
  validatePassword,
  checkToken,
  sendEmail,
  verifyJwtToken,
  cleanBody,
  joinCompanyTemplate,
  resetPasswordTemplate
} = require('../helpers');

class UserController extends BaseController {
  constructor() {
    super(User);
    this.service = new User();
    this.company = new Company();
    this.roleService = new Role();
    this.createUserAndAuth = this.createUserAndAuth.bind(this);
    this.deactivateUser = this.deactivateUser.bind(this);
    this.addUser = this.addUser.bind(this);
    this.signIn = this.signIn.bind(this);
    this.logOut = this.logOut.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.activateAccount = this.activateAccount.bind(this);
    this.inviteUserToCompany = this.inviteUserToCompany.bind(this);
    this.linkUserToCompany = this.linkUserToCompany.bind(this);
    this.personalUpdate = this.personalUpdate.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
    this.resetPasswordEmail = this.resetPasswordEmail.bind(this);
    this.checkUserToken = this.checkUserToken.bind(this);
    this.createClient = this.createClient.bind(this);
  }

  async checkUserToken(req, res) {
    try {
      const { token, decodedToken } = await checkToken(req);
      const user = await this.service.findById(decodedToken.id);
      return res.send({ token, ...user._doc });
    } catch (error) {
      return sendError(res, 'BAD_REQUEST');
    }
  }

  async createUserAndAuth(req, res) {
    try {
      const passwordHash = await hashPassword(req.body.password);
      let role = await this.roleService.findOne({ roleName: 'Cliente' });
      if (!role) role = await this.roleService.create({ roleName: 'Cliente' });
      const newUser = {
        ...req.body,
        password: passwordHash,
        appRole: role._id
      };
      const savedUser = await this.service.create(newUser).then((user) => {
        return user;
      });
      const token = await jwtSigninToken(savedUser._id);
      const updatedUser = await this.service.update(savedUser._id, {
        confirmationToken: token
      });
      const mailData = {
        subject: 'Vettier: Activación de Cuenta',
        file: 'verify_account',
        email: updatedUser.email,
        host: `${req.headers.host}${req.baseUrl}`,
        token
      };
      if (!sendEmail(mailData)) return sendError(res, 'INTERNAL_ERROR');
      return res.send({ token, user: updatedUser._id });
    } catch (error) {
      return sendError(res, 'INTERNAL_ERROR');
    }
  }

  async createClient(req, res) {
    try {
      const password = generatePassword.generate({
        length: 10,
        numbers: true,
        strict: true
      });
      const passwordHashed = await hashPassword(password);
      const role = await this.roleService.findOne({ roleName: 'Cliente' });
      const newClient = {
        ...req.body,
        password: passwordHashed,
        appRole: role._id
      };
      const client = await this.service.create(newClient).then((user) => {
        return user;
      });
      return res.send({ client });
    } catch (error) {
      return sendError(res, 'BAD_REQUEST');
    }
  }

  async addUser(req, res) {
    const { id, roleId } = req.body;
    // Also need to update the roleId
    try {
      const added = await this.service.update(id, {
        companyId: req.params.company,
        roleId
      });
      const updatedUser = await this.company.updateUsers(
        req.params.company,
        id
      );
      return res.send({ added, updatedUser });
    } catch (error) {
      console.error(error);
      return sendError(res, 'BAD_REQUEST');
    }
  }
  async signIn(req, res) {
    try {
      const { body } = req;
      if (!body.password && !body.email) {
        return sendError(res, 'BAD_REQUEST');
      }

      const user = await this.service.findOne(
        { email: body.email },
        '_id password status email firstName lastName appRole companyRole npi companyId'
      );

      const passwordValidation = await validatePassword(
        body.password,
        user.password
      );

      if (user && passwordValidation && user.status === 'active') {
        const userData = { ...user._doc };
        delete userData.password;
        const token = await jwtSigninToken(user._id);
        return res
          .cookie('access_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
          })
          .send({ token, ...userData });
      } else {
        return sendError(res, 'NOT_FOUND');
      }
    } catch (error) {
      return res.status(500).send(error.message);
    }
  }
  async logOut(req, res) {
    const { decodedToken } = checkToken(req);
    const token = await jwtSigninToken(decodedToken, 1);

    return res.clearCookie('access_token').send({ token });
  }
  async deactivateUser(req, res) {
    try {
      const { body } = req;
      const currentUser = await this.service.findById(body.userId);
      if (currentUser.status === 'deactivated')
        return sendError(res, 'BAD_REQUEST');

      return await this.service
        .deactivateUserById(body.userId, {
          status: 'deactivated'
        })
        .then((user) => {
          return res.send({ message: 'The user was deactivated', user });
        });
    } catch (error) {
      return res.status(500).send(error.message);
    }
  }

  async resetPasswordEmail(req, res) {
    try {
      const user = await this.service.findOne({ email: req.body.email });
      const token = await jwtSigninToken(user._id);
      await this.service.update(user._id, {
        confirmationToken: token
      });
      const templateResetPassword = resetPasswordTemplate(
        user.email,
        req.hostname,
        token
      );
      if (!sendEmail(templateResetPassword))
        return sendError(res, 'INTERNAL_ERROR');
      return res.send({ token });
    } catch (error) {
      return sendError(res, 'INTERNAL_ERROR');
    }
  }

  async resetPassword(req, res) {
    try {
      const { id } = req.params;
      const { password, token } = req.body;

      const { confirmationToken } = await this.service.findById(id);

      if (token !== confirmationToken) return sendError(res, 'BAD_REQUEST');

      const hashedPassword = await hashPassword(password);
      await this.service.update(id, {
        password: hashedPassword,
        confirmationToken: ''
      });
      return res.status(202).send({ message: 'Password Updated' });
    } catch (error) {
      return sendError(res, 'INTERNAL_ERROR');
    }
  }

  async changePassword(req, res) {
    try {
      const { id } = req.params;
      const { lastPassword, newPassword } = req.body;
      const previousPassword = await this.service.findOne(
        { _id: id },
        'password'
      );

      const verification = await validatePassword(
        lastPassword,
        previousPassword.password
      );
      if (!verification) return sendError(res, 'BAD_REQUEST');
      const hashedPassword = await hashPassword(newPassword);
      const updated = await this.service.update(id, {
        password: hashedPassword
      });
      if (updated) return res.status(202).send({ message: 'Password Updated' });
      return sendError(res, 'BAD_REQUEST');
    } catch (error) {
      return sendError(res, 'INTERNAL_ERROR');
    }
  }

  async activateAccount(req, res) {
    try {
      const { token } = req.query;
      const decodedToken = await verifyJwtToken(token);
      const { confirmationToken } = await this.service.findById(
        decodedToken.id
      );

      if (confirmationToken === token) {
        await this.service.update(decodedToken.id, {
          status: 'active',
          confirmationToken: ''
        });
        return res
          .status(200)
          .send({ token, redirect: true, message: 'Account Verified' });
      }
      return res.send({ message: 'Account Not Verified' });
    } catch (error) {
      return sendError(res, 'INTERNAL_ERROR');
    }
  }

  async linkUserToCompany(req, res) {
    try {
      const { token } = req.query;
      const { company } = req.params;
      const decodedToken = await verifyJwtToken(token);
      const { confirmationToken } = await this.service.findById(
        decodedToken.id
      );
      if (confirmationToken === token) {
        let readerRole = await this.roleService.findOne({
          roleName: 'Empleado Simple',
          companyId: company
        });

        if (!readerRole) {
          readerRole = await this.roleService.create({
            roleName: 'Empleado Simple',
            permissionLevel: ['read'],
            companyId: company
          });
        }
        let generalRole = await this.roleService.findOne({
          roleName: 'Empleado'
        });

        if (!generalRole)
          generalRole = await this.roleService.create({ roleName: 'Empleado' });

        await this.service.update(decodedToken.id, {
          companyId: company,
          companyRole: readerRole._id,
          appRole: generalRole._id,
          confirmationToken: ''
        });
        return res.status(200).send({ message: 'User added' });
      }
      return res.send({ message: 'User not Added' });
    } catch (error) {
      return sendError(res, 'INTERNAL_ERROR');
    }
  }

  async inviteUserToCompany(req, res) {
    try {
      const { userId } = req.body;
      const { company } = req.params;
      const user = await this.service.findById(userId);
      const token = await jwtSigninToken(user._id);
      const updatedUser = await this.service.update(user._id, {
        confirmationToken: token
      });
      const templateJoinCompany = joinCompanyTemplate(
        updatedUser.email,
        req.hostname,
        company,
        token
      );
      if (!sendEmail(templateJoinCompany))
        return sendError(res, 'INTERNAL_ERROR');
      return res.send({ token });
    } catch (error) {
      return sendError(res, 'INTERNAL_ERROR');
    }
  }

  async personalUpdate(req, res) {
    try {
      const { id } = req.params;
      const bodyClaned = cleanBody(req.body);
      const updated = await this.service.update(id, bodyClaned);
      return res.send({ updated });
    } catch (error) {
      return sendError(res, 'INTERNAL_ERROR');
    }
  }
}

module.exports = UserController;
