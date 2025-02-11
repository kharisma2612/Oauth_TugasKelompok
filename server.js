const express = require('express');
const bodyParser = require('body-parser');
const OAuth2Server = require('oauth2-server');
const model = require('./model');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const oauth = new OAuth2Server({
  model,
  grants: ['authorization_code'],
  allowBearerTokensInQueryString: true
});


app.use('/oauth/authorize', (req, res, next) => {
  const request = new OAuth2Server.Request(req);
  const response = new OAuth2Server.Response(res);

  oauth.authorize(request, response, {
    authenticateHandler: {
      handle: () => {
        return { id: 1, username: 'user' }; // User dummy
      }
    }
  })
  .then((code) => {
    res.json(code);
  })
  .catch((err) => {
    res.status(err.code || 500).json(err);
  });
});


app.post('/oauth/token', (req, res) => {
  const request = new OAuth2Server.Request(req);
  const response = new OAuth2Server.Response(res);

  oauth.token(request, response)
    .then((token) => {
      res.json(token);
    })
    .catch((err) => {
      res.status(err.code || 500).json(err);
    });
});


app.get('/secure', (req, res, next) => {
  const request = new OAuth2Server.Request(req);
  const response = new OAuth2Server.Response(res);

  oauth.authenticate(request, response)
    .then(() => {
      res.json({ message: 'Anda berhasil mengakses endpoint yang dilindungi!' });
    })
    .catch((err) => {
      res.status(err.code || 500).json(err);
    });
});

app.listen(3000, () => {
  console.log('Server berjalan di http://localhost:3000');
});