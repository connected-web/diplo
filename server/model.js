const path = require('path')
const chokidar = require('chokidar')
const { read } = require('promise-path')

const assets = {}
const config = {
  port: 49625,
  buildPath: path.join(__dirname, '../build'),
  workingPath: path.join(__dirname, '../sampledata'),
  date: new Date()
}
const objects = {}

const model = {
  assets,
  config,
  objects
}

module.exports = model

setInterval(updateDatastore, 250)

async function updateDatastore(path, remove=false) {
  config.date = new Date()

  if (path) {
    const route = path.replace(config.workingPath, '').replace(/\\/g, '/').split('/')
    route.shift()

    const containerType = route[0]
    const fileName = route[route.length - 1]
    const container = model[containerType] || false
    if (container) {
        console.log(`${route.join(' / ')} has changed, updating ${fileName} in ${containerType}`)
        if (containerType === 'objects' && fileName.includes('.json')) {
          const objectType = route[1]
          if (remove === true) {
            if (container[objectType]) {
              delete container[objectType][fileName]
            }
          }
          else {
            const body = JSON.parse(await read(path, 'utf8'))
            container[objectType] = container[objectType] || {}
            container[objectType][fileName] = body
          }
        }
    } else {
      console.log(`${route.join(' / ')} has changed, but no plan to store.`)
    }
  }
}

function remove(path) {
  if (path) {
    console.log(`${path} has been removed`)
    updateDatastore(path, true)
  }
}

function fileAdded(path, ev) {
  updateDatastore(path)
}

function fileChanged(path, ev) {
  updateDatastore(path)
}

function fileRemoved(path, ev) {
  updateDatastore(path, true)
}

console.log('Watching for file changes:', config.workingPath)

// One-liner for current directory, ignores .dotfiles
chokidar.watch(config.workingPath, {ignored: /(^|[\/\\])\../})
  .on('add', fileAdded)
  .on('change', fileChanged)
  .on('unlink', fileRemoved)
