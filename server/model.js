const fs = require('fs')
const path = require('path')
const { make } = require('promise-path')
const filestore = require('./filestore')
const regeneratePresentables = require('./presentables').regenerate
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
const presentables = []

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

async function saveObjectType(payload) {
  const objectType = payload.objectType + ''
  const objectData = payload.objectData || {}
  delete objectData.id

  if (objectType) {
    const objectPath = path.join(config.objectsPath, `${objectType}s`)
    await make(objectPath)

    const filename = `${objectType}_properties.json`
    const filepath = path.join(objectPath, filename)
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
  saveObject,
  saveObjectType
}

function save(payload) {
  payload = payload || {}
  action = actions[payload.action] || noop
  action(payload)
}

function updated() {
  regeneratePresentables(model)
}

const model = {
  assets,
  config,
  objects,
  templates,
  presentables,
  save,
  updated
}

filestore.attachTo(model)

module.exports = model
