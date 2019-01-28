const config = require('../config/config')
const Git = require('../libs/Git')
const AppError = require('../libs/AppError')
class Github extends Git {
  async getAccessToken (code) {
    let info = await super.getAccessToken(config.gitHub.access_token_url, {
      client_id: config.gitHub.client_id,
      client_secret: config.gitHub.client_secret,
      code: code
    }, 'Accept', 'application/json')
    if (info.body.error) {
      throw new AppError({
        name: 'AUTH_ERROR',
        message: info.body.error_description,
        status: 401
      })
    }
    return info.body.access_token
  }

  async getUserName (token) {
    try {
      let info = await super.getUserInfo(`https://api.github.com/user?access_token=${token}`)
      return info.body.login
    } catch (error) {
      throw new AppError({
        name: 'AUTH_ERROR',
        message: error.response.body.message,
        status: error.response.status
      })
    }
  }

  async clone (user, repoName) {
    await super.clone(`https://github.com/${user.name}/${repoName}.git`)
  }

  async push (user, repoName) {
    await super.changeRemoteAddr(`https://github.com/${user.name}/${repoName}.git`)
    return super.push(user.token, user.name)
  }
}

module.exports = new Github()
