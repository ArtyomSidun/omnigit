module.exports = {
  server: {
    port: process.env.PORT || 5000
  },
  gitHub: {
    client_id: '',
    client_secret: '',
    access_token_url: 'https://github.com/login/oauth/access_token'
  },
  gitLab: {
    client_id: '',
    client_secret: '',
    access_token_url: 'https://gitlab.com/oauth/token'
  },
  bitbucket: {
    client_id: '',
    client_secret: '',
    access_token_url: 'https://bitbucket.org/site/oauth2/access_token'
  }
}
