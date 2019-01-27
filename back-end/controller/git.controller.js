const Github = require('../service/github.service')
const Gitlab = require('../service/gitlab.service')
const Bitbucket = require('../service/bitbucket.service')
const m = {}
const providerList = {
  'github': Github,
  'gitlab': Gitlab,
  'bitbucket': Bitbucket
}
  

m.getCurrentRepo = async (req, res, next) => {
  try {
    const provider = providerMaper(req.body.repo)
    const access_token = await provider.getAccessToken(req.body.code)
    const username = await provider.getUserName(access_token)
    provider.clone({name: username, token: access_token}, req.body.repoName)
    res.json(true)
  } catch (err) {
    console.log(err)
  }
}

m.pushRepo = async (req, res, next) => {
  const provider = providerMaper(req.body.repo)
  const access_token = await provider.getAccessToken(req.body.code)
  const username = await provider.getUserName(access_token)
  provider.push({name: username, token: access_token}, req.body.repoName)
  res.json(true)
}

function providerMaper(providerName) {
  return providerList[providerName]
}

module.exports = m
