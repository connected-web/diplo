const chokidar = require('chokidar')
const { read } = require('promise-path')

function attachTo(model) {
  async function updateDatastore(path, remove=false) {
    model.config.date = new Date()

    if (path) {
      const route = path.replace(model.config.workingPath, '').replace(/\\/g, '/').split('/')
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

  // Respond to file system changes
  function fileAdded(path, ev) {
    updateDatastore(path)
  }

  function fileChanged(path, ev) {
    updateDatastore(path)
  }

  function fileRemoved(path, ev) {
    console.log(`${path} has been removed`)
    updateDatastore(path, true)
  }

  console.log('Watching for file changes:', model.config.workingPath)

  // One-liner for current directory, ignores .dotfiles
  chokidar.watch(model.config.workingPath, {ignored: /(^|[\/\\])\../})
    .on('add', fileAdded)
    .on('change', fileChanged)
    .on('unlink', fileRemoved)

  // Update the datastore timer
  setInterval(updateDatastore, 250)
}

module.exports = { attachTo }
