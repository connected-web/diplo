const path = require('path')
const Nightmare = require('nightmare')

function render(url, filename) {
  return Nightmare()
    .goto(url)
    .screenshot(filename)
}

function configure(model) {
  const { workingPath, port } = model.config
  const serverPath = `http://localhost:${port}`
  async function handleRequest(req, res) {
    const { typeId, itemId, templateId } = req.params
    const context = `Trying to render image for ${templateId} using ${typeId}, ${itemId}`
    const assetPath = path.join(workingPath, 'assets', `${typeId}-${itemId}-${templateId}.png`)
    console.log(`[RENDER] ${context}`)

    try {
      const presentableUrl = `${serverPath}/api/present/${typeId}/${itemId}/${templateId}`
      await render(presentableUrl, assetPath)
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
