module.exports = {
  // Data
  collection: 'auths',
  publicCollection: 'users',
  user: {
    id: true,
    email: true
  },

  // Urls
  urls: {
    base: 'auth',
    changeemail: 'changeemail',
    changepassword: 'changepassword',
    recoverpassword: 'recoverpassword',
    resetpassword: 'resetpassword',
    login: 'login',
    logout: 'logout',
    logoutuser: 'logoutuser',
    register: 'register',
    confirmregistration: 'confirmregistration',
    confirmemailchange: 'confirmemailchange'
  },

  // Local provider
  encryption: 'bcryptjs', // 'bcryptjs' (js) or 'bcrypt' (native) or 'sha-1'
  encryptionStrength: 10,
  localField: 'local',
  emailField: 'email',
  emailChangeField: 'emailChange',
  hashField: 'hash',
  saltField: 'salt',
  confirmEmailTimeLimit: '3d', // ms formats possible: 0.5y, 1d, 10h, etc
  resetPasswordTimeLimit: '3d', // 3 days
  confirmRegistration: true, // should we send email to confirm address or login user immediately

  // Passport
  passport: {
    userProperty: 'userIds',
  },
  strategies: {},

  queryCookieFiled: '__query',

  // Some values to use in hooks
  confirmEmailChangeUrl: '/confirmemailchange',
  confirmRegistrationUrl: '/confirmregistration',
  emailChangeConfirmedUrl: '/emailchangeconfirmed',
  loginUrl: '/login',
  recoverPasswordUrl: '/recoverpassword',
  registrationConfirmedUrl: '/registrationconfirmed',
  providerErrorUrl: '/providererror',
  successUrl: '/',

  errors: {
    alreadyConfirmed: 'Already confirmed',
    confirmationExpired: 'Confirmation is expired',
    equalEmails: 'Old and new emails are equal',
    noLocal: 'User is not registered with email/password',
    noUser: 'User is not registered',
    noUserByEmail: 'No user with this email',
    noUserBySecret: 'Wrong secret. Maybe your reset password link is out of date',
    providerExists: 'User is already registered with this provider',
    resetPasswordExpired: 'Reset password is expired',
    userExists: 'User already exists',
    wrongOldPassword: 'Old password is wrong',
    wrongPassword: 'Password is wrong'
  },

  emailRegex: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,

  // To tell the truth you can redifine not only hook but also api and routes
  // (any of the Login functions)

  hooks: {
    // Next hooks are for parsing values from requests for different operations
    // Parsing requests manually makes possible creating forms with different fields
    // It's good place for validation

    parseChangeEmailRequest: require('./hooks/parseChangeEmailRequest'),
    parseChangePasswordRequest: require('./hooks/parseChangePasswordRequest'),
    parseConfirmEmailRequest: require('./hooks/parseConfirmEmailRequest'),
    parseLoginRequest: require('./hooks/parseLoginRequest'),
    parseRegisterRequest: require('./hooks/parseRegisterRequest'),
    parseRegisterProvider: require('./hooks/parseRegisterProvider'),
    parseRecoverPasswordRequest: require('./hooks/parseRecoverPasswordRequest'),
    parseResetPasswordRequest: require('./hooks/parseResetPasswordRequest'),

    sendChangeEmailConfirmation: require('./hooks/sendChangeEmailConfirmation'),
    sendRegistrationInfo: require('./hooks/sendRegistrationInfo'),
    sendRegistrationConfirmation: require('./hooks/sendRegistrationConfirmation'),
    sendRegistrationConfirmationComplete: require('./hooks/sendRegistrationConfirmationComplete'),
    sendRecoveryConfirmation: require('./hooks/sendRecoveryConfirmation'),
    sendChangePassword: require('./hooks/sendChangePassword'),
    sendResetPassword: require('./hooks/sendResetPassword'),

    request: require('./hooks/request'),
    response: require('./hooks/response'),
    error: require('./hooks/error')
  }
};
