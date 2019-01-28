
class AppError extends Error {
  constructor(error = {}) {
    super()
    if (error) {
      this.name = error.name
      this.message = error.message
      this.status = error.status
      this.errorMessages = error.errorMessages
    } else {
      this.name = 'Unexpected error'
      this.message = 'Unexpected error has occurred'
      this.status = 500
      this.code = 'UNEXPECTED_ERROR'
    }
  }

  static handle404 (req, res, next) {
    next(new AppError({
      name: 'RESOURCE_NOT_FOUND',
      message: 'Resource not found',
      status: 404
    }))
  }

  static handler (err, req, res, next) {
    res.status(err.status || 500)

    const error = {
      name: err.name,
      message: err.message,
      errorMessages: err.errorMessages
    }

    res.json(error)
  }
}

module.exports = AppError
