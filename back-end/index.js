const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const config = require('./config/config')
const router = require('./routes/git.route')
const AppError = require('./libs/AppError')

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})
const expressSwagger = require('express-swagger-generator')(app)

app.use(bodyParser.json({ type: 'application/json' }))
app.use('', express.static('./dist/front-end'))
app.use(router)

let options = {
  swaggerDefinition: {
    info: {
      description: '',
      title: 'Omnigit documentation',
      version: '1.0.0'
    },
    host: `localhost:${config.server.port}`,
    basePath: '/',
    produces: [
      'application/json'
    ],
    schemes: ['http', 'https']
  },
  basedir: __dirname,
  files: ['./routes/*.js']
}

expressSwagger(options)

app.use(AppError.handle404)
app.use(AppError.handler)

app.listen(config.server.port, () => console.log(`Example app listening on port ${config.server.port}!`))
