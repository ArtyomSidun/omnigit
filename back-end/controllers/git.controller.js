const Github = require('../services/github.service')
const Gitlab = require('../services/gitlab.service')
const Bitbucket = require('../services/bitbucket.service')
const AppError = require('../libs/AppError')
const m = {}
const providerList = {
  'github': Github,
  'gitlab': Gitlab,
  'bitbucket': Bitbucket
}

const providerMaper = (providerName) => {
  const provider = providerList[providerName]
  if (!provider) {
    throw new AppError({
      name: 'PROVIDER_NOT_FOUND',
      message: `Provider "${providerName}" not found`,
      status: 404
    })
  }

  return provider
}

m.getCurrentRepo = async (req, res, next) => {
  try {
    const { code, repoName, providerName } = req.body
    const provider = providerMaper(providerName)
    const accessToken = await provider.getAccessToken(code)
    const username = await provider.getUserName(accessToken)
    await provider.clone({ name: username, token: accessToken }, repoName)
    res.json(true)
  } catch (err) {
    next(err)
  }
}

m.pushRepo = async (req, res, next) => {
  try {
    const { code, repoName, providerName } = req.body
    const provider = providerMaper(providerName)
    const accessToken = await provider.getAccessToken(code)
    const username = await provider.getUserName(accessToken)
    provider.push({ name: username, token: accessToken }, repoName)
    res.json(true)
  } catch (err) {
    next(err)
  }
}

module.exports = m
