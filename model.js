const crypto = require('crypto');

const clients = [
  { clientId: 'abc123', clientSecret: 'contoh_client_secret', redirectUris: ['http://localhost:3000/callback'], grants: ['authorization_code'] }
];

const tokens = {};
const authorizationCodes = {};

module.exports = {
  getClient: (clientId, clientSecret) => {
    return clients.find(client => client.clientId === clientId && client.clientSecret === clientSecret);
  },

  saveAuthorizationCode: (code, client, user) => {
    authorizationCodes[code.authorizationCode] = { client, user, expiresAt: code.expiresAt };
    return code;
  },

  getAuthorizationCode: (authorizationCode) => {
    return authorizationCodes[authorizationCode];
  },

  revokeAuthorizationCode: (code) => {
    delete authorizationCodes[code.authorizationCode];
    return true;
  },

  saveToken: (token, client, user) => {
    tokens[token.accessToken] = { client, user, expiresAt: token.accessTokenExpiresAt };
    return { accessToken: token.accessToken, accessTokenExpiresAt: token.accessTokenExpiresAt, client, user };
  },

  getAccessToken: (accessToken) => {
    return tokens[accessToken];
  }
};