const fs = require('fs')
const path = require('path')
const filestore = require('./filestore')
const noop = () => {}

const assets = []
const config = {
  port: 49625,
  buildPath: path.join(__dirname, '../build'),
  workingPath: path.join(__dirname, '../sampledata'),
  date: new Date()
}

config.assetsPath = path.join(config.workingPath, 'assets')
config.objectsPath = path.join(config.workingPath, 'objects')

const objects = []
const templates = []



function saveObject(payload) {
  const objectType = payload.objectType + ''
  const objectData = payload.objectData || {}
  const objectId = objectData.id
  delete objectData.id

  if (objectType && objectId) {
    const filename = `${objectType}-${objectId}.json`
    const filepath = path.join(config.objectsPath, `${objectType}s`, filename)
    const contents = JSON.stringify(objectData, null, 2)
    fs.writeFile(filepath, contents, 'utf8', (err, result) => {
      console.log('[Server Model] Wrote', filepath, contents.length, 'bytes')
      if(err) {
        console.error('  Error:', err)
      }
    })
  }
}

const actions = {
  saveObject
}

function save(payload) {
  payload = payload || {}
  action = actions[payload.action] || noop
  action(payload)
}

const model = {
  assets,
  config,
  objects,
  templates,
  save
}

filestore.attachTo(model)

module.exports = model
