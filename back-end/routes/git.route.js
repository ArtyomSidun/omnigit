const router = require('express').Router()
const { check, validationResult } = require('express-validator/check')

const gitController = require('../controllers/git.controller')
const AppError = require('../libs/AppError')

const validationMiddleware = (req, res, next) => {
  const errorFormatter = ({ location, msg, param, value, nestedErrors }) => `${location}.${param} = ${value} - ${msg}`
  const result = validationResult(req).formatWith(errorFormatter)
  if (result.isEmpty()) {
    return next()
  }
  const messages = result.array()

  const error = new AppError({
    name: 'VALIDATION_ERROR',
    message: messages[0],
    errorMessages: messages,
    status: 422
  })
  next(error)
}

router.post('/get_current_repo', [
  check('providerName').exists().isString(),
  check('code').exists().isString(),
  check('repoName').exists().isString()
], validationMiddleware, gitController.getCurrentRepo)
router.post('/push_repo', [
  check('providerName').exists().isString(),
  check('code').exists().isString()
], validationMiddleware, gitController.pushRepo)

module.exports = router
