const express = require('express')
const path = require('path')
const chokidar = require('chokidar')
const { read } = require('promise-path')

const app = express()
const config = {
  port: 49625,
  buildPath: path.join(__dirname, 'build'),
  workingPath: path.join(__dirname, 'sampledata'),
  date: new Date()
}

const model = {
  objects: {},
  assets: {}
}

const objects = model.objects
const assets = model.assets

async function update(path) {
  config.date = new Date()

  if (path) {
    const route = path.replace(config.workingPath, '').replace(/\\/g, '/').split('/')
    route.shift()

    const containerType = route[0]
    const fileName = route[route.length - 1]
    const container = model[containerType] || false
    if (container) {
        console.log(`${route.join(' / ')} has changed, storing ${fileName} in ${containerType}`)
        if (containerType === 'objects' && fileName.includes('.json')) {
          const objectType = route[1]
          const body = JSON.parse(await read(path, 'utf8'))
          container[objectType] = container[objectType] || {}
          container[objectType][fileName] = body
        }
    } else {
      console.log(`${route.join(' / ')} has changed, but no plan to store.`)
    }
  }
}

function remove(path) {
  if (path) {
    console.log(`${path} has been removed`)
  }
}

console.log('Watching for file changes:', config.workingPath)

// One-liner for current directory, ignores .dotfiles
chokidar.watch(config.workingPath, {ignored: /(^|[\/\\])\../})
  .on('add', update)
  .on('change', update)
  .on('unlink', remove)

setInterval(update, 250)

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', (req, res) => res.redirect('/diplo'))
app.get('/api/config', (req, res) => res.json(config))
app.get('/api/objects', (req, res) => res.json(objects))
app.get('/api/global', (req, res) => res.json(model))
app.use('/diplo', express.static(config.buildPath))

app.listen(config, listening)

function listening(err) {
  if (err) {
    return console.error(`[Diplo Server] Unable to start server on port ${config.port}`)
  }
  console.log(`[Diplo Server] Listening on on port http://localhost:${config.port}`)
}
