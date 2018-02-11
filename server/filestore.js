const path = require('path')
const chokidar = require('chokidar')
const { read } = require('promise-path')

function attachTo(model) {

  const virtualFileSystem = {}
  const VFS = virtualFileSystem

  const matchers = [{
    regex: /^\/objects\/([A-z\d]+)s\/\1-([A-z\d-]+)\.json$/,
    action: updateObjectInstance
  }, {
    regex: /^\/objects\/([A-z\d]+)s\/\1_properties\.json$/,
    action: updateObjectProperties
  }, {
    regex: /^\/objects\/([A-z\d]+)s\/templates\/template-\1-([A-z\d-]+)\.json$/,
    action: updateTemplateProperties
  }, {
    regex: /^\/objects\/([A-z\d]+)s\/templates\/template-\1-([A-z\d-]+)\.(html)$/,
    action: updateTemplateSource
  }]

  function updateObjectInstance(filepath, regex, remove=false) {
    console.log('[Filestore] Matched', filepath, 'using', regex)
    const matches = filepath.match(regex)
    const objectType = matches[1]
    const objectId = matches[2]

    const object = model.objects[objectType] || { items: [] }
    if (remove) {
      object.items = object.items.filter(n => n.id !== objectId)
    } else {
      const objectInstance = JSON.parse(VFS[filepath])
      objectInstance.id = objectId
      object.items.push(objectInstance)
    }
    model.objects[objectType] = object
  }

  function updateObjectProperties(filepath, regex, remove=false) {
    const matches = filepath.match(regex)
    const objectType = matches[1]

    const object = model.objects[objectType] || { items: [] }
    if (remove) {
      delete object.properties
    } else {
      object.properties = JSON.parse(VFS[filepath])
    }
    model.objects[objectType] = object
  }

  function updateTemplateProperties(filepath, regex, remove=false) {
    const matches = filepath.match(regex)
    const objectType = matches[1]
    const templateId = matches[2]

    const key = `${objectType}-${templateId}`
    const template = model.templates[key] || {}
    if (remove) {
      delete template.properties
    } else {
      template.properties = JSON.parse(VFS[filepath])
    }
    model.templates[key] = template
  }

  function updateTemplateSource(filepath, regex, remove=false) {
    const matches = filepath.match(regex)
    const objectType = matches[1]
    const templateId = matches[2]

    const key = `${objectType}-${templateId}`
    const template = model.templates[key] || {}
    if (remove) {
      delete template.source
    } else {
      template.source = VFS[filepath]
    }
    model.templates[key] = template
  }

  async function updateDatastore(filepath, remove=false) {
    model.config.date = new Date()

    if (filepath) {
      const route = filepath.replace(model.config.workingPath, '').split(path.sep)
      const pathstring = route.join('/')

      if (remove) {
        delete VFS[pathstring]
      } else {
        VFS[pathstring] = await read(path.join(model.config.workingPath, pathstring), 'utf8')
        matchers.forEach((matcher) => {
          if (matcher.regex.test(pathstring)) {
            matcher.action(pathstring, matcher.regex, remove)
          }
        })
      }
    }


  }

  // Respond to file system changes
  function fileAdded(filepath, ev) {
    updateDatastore(filepath)
  }

  function fileChanged(filepath, ev) {
    updateDatastore(filepath)
  }

  function fileRemoved(filepath, ev) {
    console.log(`${filepath} has been removed`)
    updateDatastore(filepath, true)
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
