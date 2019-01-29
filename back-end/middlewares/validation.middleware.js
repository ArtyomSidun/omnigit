const { validationResult } = require('express-validator/check')
const AppError = require('../libs/AppError')
const m = {}

m.validationMiddleware = (req, res, next) => {
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

module.exports = m.validationMiddleware
