const path = require('path')
const chokidar = require('chokidar')
const { read } = require('promise-path')

function attachTo(model) {

  const virtualFileSystem = {}
  const VFS = virtualFileSystem
  const objectIndex = {}
  const templateIndex = {}

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

    const object = objectIndex[objectType] || { items: [] }
    if (remove) {
      object.items = object.items.filter(n => n.id !== objectId)
    } else {
      const objectInstance = JSON.parse(VFS[filepath])
      objectInstance.id = objectId
      object.items.push(objectInstance)
    }
    objectIndex[objectType] = object
  }

  function updateObjectProperties(filepath, regex, remove=false) {
    const matches = filepath.match(regex)
    const objectType = matches[1]

    const object = objectIndex[objectType] || { items: [] }
    if (remove) {
      delete object.properties
    } else {
      object.properties = JSON.parse(VFS[filepath])
    }
    objectIndex[objectType] = object
  }

  function updateTemplateProperties(filepath, regex, remove=false) {
    const matches = filepath.match(regex)
    const objectType = matches[1]
    const templateId = matches[2]

    const key = `${objectType}-${templateId}`
    const template = templateIndex[key] || {}
    if (remove) {
      delete template.properties
    } else {
      template.properties = JSON.parse(VFS[filepath])
    }
    templateIndex[key] = template
  }

  function updateTemplateSource(filepath, regex, remove=false) {
    const matches = filepath.match(regex)
    const objectType = matches[1]
    const templateId = matches[2]

    const key = `${objectType}-${templateId}`
    const template = templateIndex[key] || {}
    if (remove) {
      delete template.source
    } else {
      template.source = VFS[filepath]
    }
    templateIndex[key] = template
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
            updateModelList()
          }
        })
      }
    }
  }

  function updateModelList() {
    // Update object list
    while (model.objects.length > 0) {
      model.objects.pop()
    }
    Object.keys(objectIndex).forEach(key => {
      const object = objectIndex[key]
      object.id = key
      model.objects.push(object)
    })

    // Update template list
    while (model.templates.length > 0) {
      model.templates.pop()
    }
    Object.keys(templateIndex).forEach(key => {
      const template = templateIndex[key]
      template.id = key
      model.templates.push(template)
    })
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
