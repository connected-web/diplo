const express = require('express')
const bodyParser = require('body-parser')

const model = require('./server/model')
const present = require('./server/present')
const render = require('./server/render')

const app = express()

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

function serve(model, key) {
  return (req, res) => {
    const data = key ? model[key] : model
    const keyName = key || 'global'

    res.json(data || {})
    // console.log(`[Diplo Server] [${keyName}] Serving ${req.originalUrl}`)
  }
}

function handle(model) {
  console.log('[Diplo Server] Create route to handle POST requests')
  return (req, res) => {
    const payload = req.body
    console.log('[Server] /api/save received', payload)
    res.json({
      message: 'Handled',
      timestamp: new Date().toJSON()
    })
    model.save(payload)
  }
}

app.get('/', (req, res) => res.redirect('/diplo'))
app.get('/api/assets', serve(model, 'assets'))
app.get('/api/config', serve(model, 'config'))
app.get('/api/objects', serve(model, 'objects'))
app.get('/api/global', serve(model))
app.get('/api/present/:typeId/:itemId/:templateId', present(model))
app.get('/api/render/:typeId/:itemId/:templateId', render(model))
app.post('/api/save', bodyParser.json(), handle(model))
app.use('/api/assets', express.static(model.config.assetsPath))
app.use('/diplo', express.static(model.config.buildPath))

app.listen(model.config, listening)

function listening(err) {
  if (err) {
    return console.error(`[Diplo Server] Unable to start server on port ${model.config.port}`)
  }
  console.log(`[Diplo Server] Listening on on port http://localhost:${model.config.port}`)
}
