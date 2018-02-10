const path = require('path')
const filestore = require('./filestore')

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

filestore.attachTo(model)

module.exports = model
