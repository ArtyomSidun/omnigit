const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3001
const gitController = require('./controller/git.controller')
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next();
})

app.use(bodyParser.json({ type: 'application/json' }))

app.post('/get_current_repo', gitController.getCurrentRepo)
app.post('/push_repo', gitController.pushRepo)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
