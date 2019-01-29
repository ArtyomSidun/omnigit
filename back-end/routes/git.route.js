const router = require('express').Router()
const { check } = require('express-validator/check')

const gitController = require('../controllers/git.controller')

const validationMiddleware = require('../middlewares/validation.middleware')

/**
 * @typedef Git
 * @property {string} providerName.required - provider name(github, bitbucket, gitlab)
 * @property {string} code.required - code from provider
 * @property {string} repoName.required - name of repository
 */

/**
 * This function is using to clone the current repo
 * @route POST /get_current_repo
 * @group Git - Operations with git
 * @param {Git.model} body.body.required - body
 * @returns 200 - return `true` if repository cloned
 */
router.post('/get_current_repo', [
  check('providerName').exists().isString(),
  check('code').exists().isString(),
  check('repoName').exists().isString()
], validationMiddleware, gitController.getCurrentRepo)

/**
 * This function is using to push the current repo
 * @route POST /push_repo
 * @group Git - Operations with git
 * @param {Git.model} body.body.required - body
 * @returns 200 - return `true` if repository cloned
 */
router.post('/push_repo', [
  check('providerName').exists().isString(),
  check('code').exists().isString()
], validationMiddleware, gitController.pushRepo)

module.exports = router
