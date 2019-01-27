const config = require('../config/config')
const Git = require('../lib/git.lib')

class Github extends Git {
    constructor() {
        super()
    }

    async getAccessToken(code) {
        let info = await super.getAccessToken(config.gitHub.access_token_url, {
            client_id: config.gitHub.client_id,
            client_secret: config.gitHub.client_secret,
            code: code
        }, 'Accept', 'application/json')

        return JSON.parse(info.text).access_token
    }

    async getUserName(token) {
        let info = await super.getUserInfo(`https://api.github.com/user?access_token=${token}`)
        return JSON.parse(info.text).login
    }

    clone(user, repoName) {
        super.clone(`https://github.com/${user.name}/${repoName}.git`)
    }

    async push(user, repoName) {
        console.log(user.token)
        await super.changeRemoteAddr(`https://github.com/${user.name}/${repoName}.git`)
        return super.push(user.token, user.name)
    }
}

module.exports = new Github()