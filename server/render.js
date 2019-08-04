const path = require('path')
const Nightmare = require('nightmare')

function render(url, filename, clipRectangle) {
  return Nightmare({
      frame: false,
      useContentSize: true,
      transparent: true,
    })
    .viewport(clipRectangle.width, clipRectangle.height)
    .goto(url)
    .wait('body')
    .screenshot(filename, clipRectangle)
    .end()
}

function configure(model) {
  const { workingPath, port } = model.config
  const serverPath = `http://localhost:${port}`
  async function handleRequest(req, res) {
    const { typeId, itemId, templateId } = req.params
    const template = model.templates.filter(template => template.id === templateId)[0] || {}
    const properties = template.properties || { size: { width: 100, height: 100 } }
    const clipRectangle = { x: 0, y: 0, width: properties.size.width, height: properties.size.height }

    const context = `Trying to render image for ${templateId} using ${typeId}, ${itemId}`
    const assetPath = path.join(workingPath, 'assets', `${typeId}-${itemId}-${templateId}.png`)
    console.log(`[RENDER] ${context}`, 'Size', properties.size)

    try {
      const presentableUrl = `${serverPath}/api/present/${typeId}/${itemId}/${templateId}`
      await render(presentableUrl, assetPath, clipRectangle)
      res.sendFile(assetPath)
    }
    catch (ex) {
      res.json({
        message: ex.message,
        exception: ex
      })
    }
  }

  return handleRequest
}

module.exports = configure
