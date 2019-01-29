const cmd = require('node-cmd')
const Git = require('../libs/Git')
const config = require('../config/config')

class Gitlab extends Git {
  async getAccessToken (code) {
    let info = await super.getAccessToken(config.gitLab.access_token_url, {
      client_id: config.gitLab.client_id,
      client_secret: config.gitLab.client_secret,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: 'http://localhost:4200?repo=gitlab'
    }, 'content-type', 'application/x-www-form-urlencoded')
    return JSON.parse(info.text).access_token
  }

  async getUserName (token) {
    let info = await super.getUserInfo(`https://gitlab.com/api/v4/user?access_token=${token}`)
    return JSON.parse(info.text).username
  }

  async clone (user, repoName) {
    await super.clone(`https://oauth2:${user.token}@gitlab.com/${user.name}/${repoName}.git`)
  }

  async push (user, repoName) {
    await super.changeRemoteAddr(`https://oauth2:${user.token}@gitlab.com/${user.name}/${repoName}.git`)
    await super.push(user.token, user.name)
  }
}

module.exports = new Gitlab()
