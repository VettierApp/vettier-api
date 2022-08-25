const env = require('../../../config');

exports.activationAccountTemplate = (mail, host, token) => {
  return {
    from: 'Remitente <verification-account@VetApp.co>',
    subject: 'Account Verification Vet App Group',
    to: mail,
    html: `
      <h1> VETAPP GROUP</h1>

      Welcome to <strong>VETAPP</strong> the best pet platform manage.

      Click <a href=http://${host}:${env.port}/api/v1/user/activation?token=${token}> here </a> to activate your account.`
  };
};

exports.joinCompanyTemplate = (mail, host, company, token) => {
  return {
    from: 'Remitente <enterprises@VetApp.co>',
    subject: 'Liking with EntrepriseName Vet App Group',
    to: mail,
    html: `
        <h1> VETAPP GROUP</h1>

        The enterprise <strong>Name</name> wish work with you

        Click <a href=http://${host}:${env.port}/api/v1/user/${company}/link?token=${token}> here </a> to Accept.`
  };
};

exports.changePassword = (mail) => {
  return {
    from: 'Remitente <changepassword@VetApp.co>',
    subject: 'Change password',
    to: mail,
    html: `
        <h1> VETAPP GROUP</h1>

        This email will help you to change your password

        Click <a href=http://www.google.com> here </a> to Accept.`
  };
};

exports.resetPasswordTemplate = (mail, host, token) => {
  return {
    from: 'Remitente <resetPassword@VetApp.co>',
    subject: 'Reset Password in Vet App Group',
    to: mail,
    html: `
        <h1> VETAPP GROUP</h1>

        This email will help you to reset your password

        Click <a href=http://${host}:${env.port}/api/v1/user/link?token=${token}> here </a> to Accept.`
  };
};
