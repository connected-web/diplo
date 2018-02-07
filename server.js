const express = require('express')
const path = require('path')

const app = express()
const config = {
    port: 49625,
    buildPath: path.join(__dirname, 'build'),
    date: new Date()
}

function update() {
  config.date = new Date()
}

setInterval(update, 250)

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', (req, res) => res.redirect('/diplo'))
app.get('/api/config', (req, res) => res.json(config))
app.use('/diplo', express.static(config.buildPath))

app.listen(config, listening)

function listening(err) {
    if (err) {
        return console.error(`[Diplo Server] Unable to start server on port ${config.port}`)
    }
    console.log(`[Diplo Server] Listening on on port http://localhost:${config.port}`)
}
