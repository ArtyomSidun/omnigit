const config = require('../config/config')
const Git = require('../libs/Git')
const AppError = require('../libs/AppError')

class Bitbucket extends Git {
  async getAccessToken (code) {
    try {
      let info = await super.getAccessToken(
        `${config.bitbucket.access_token_url}`, {
          client_id: config.bitbucket.client_id,
          client_secret: config.bitbucket.client_secret,
          code: code,
          grant_type: 'authorization_code'
        }, 'content-type', 'application/x-www-form-urlencoded')
      return info.body.access_token
    } catch (error) {
      throw new AppError({
        name: 'AUTH_ERROR',
        message: error.response.body.error_description,
        status: error.response.status
      })
    }
  }

  async getUserName (token) {
    try {
      let info = await super.getUserInfo(`https://api.bitbucket.org/2.0/user?access_token=${token}`)
      return JSON.parse(info.text).username
    } catch (error) {
      throw new AppError({
        name: 'AUTH_ERROR',
        message: error.response.body.error_description,
        status: error.response.status
      })
    }
  }

  async clone (user, repoName) {
    await super.clone(`https://x-token-auth:${user.token}@bitbucket.org/${user.name}/${repoName}.git`)
  }

  async push (user, repoName) {
    await super.changeRemoteAddr(`https://${user.name}@bitbucket.org/${user.name}/${repoName}.git`)
    await super.push(user.token, user.name)
  }
}

module.exports = new Bitbucket()
