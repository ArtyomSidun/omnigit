const express = require('express')
const app = express()
const port = 3001
const gitController = require('./controller/git.controller')
app.get('/clone', gitController.clone)
app.post('/get_current_repo', gitController.getCurrentRepo)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
