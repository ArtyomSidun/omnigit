const config = require('../config/config')
const Git = require('../lib/git.lib')

class Bitbucket extends Git {
    constructor() {
        super()
    }

    async getAccessToken(code) {
        let info = await super.getAccessToken(
            `${config.bitbucket.access_token_url}`, {
                client_id: config.bitbucket.client_id,
                client_secret: config.bitbucket.client_secret,
                code: code,
                grant_type: "authorization_code"
        },'content-type', 'application/x-www-form-urlencoded')
        return JSON.parse(info.text).access_token
    }

    async getUserName(token) {
        let info = await super.getUserInfo(`https://api.bitbucket.org/2.0/user?access_token=${token}`)
        console.log(info.text)
        return JSON.parse(info.text).username
    }

    clone(user, repoName) {
        super.clone(`https://x-token-auth:${user.token}@bitbucket.org/${user.name}/${repoName}.git`)
    }

    async push(user, repoName) {
        await super.changeRemoteAddr(`https://${user.name}@bitbucket.org/${user.name}/${repoName}.git`)
        return super.push(user.token, user.name)
    }
}

module.exports = new Bitbucket()