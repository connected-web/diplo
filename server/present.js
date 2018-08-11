const handlebars = require('handlebars')

function configure(model) {

  function serve(req, res) {
    const typeId = req.params.typeId
    const itemId = req.params.itemId
    const templateId = req.params.templateId

    const template = model.templates.filter(template => template.id === templateId)[0] || {}
    const type = model.objects.filter(object => object.id === typeId)[0] || { items: [] }
    const item = type && type.items.filter(item => item.id === itemId)[0] || false

    let templateFn = handlebars.compile(template.source || '')

    const context = `Trying to render template for ${templateId} using ${typeId}, ${itemId}`

    console.log(`[SERVE] ${context}`)

    if (!template || !template.source) {
      console.error(`[SERVE] No template found with template id: '${templateId}'`)
      return res.status(404).json({status: 404, error: `No template found with template id: '${templateId}'`, context})
    }

    if (!type) {
      console.error(`[SERVE] No object type found with type id: '${typeId}'`)
      return res.status(404).json({status: 404, error: `No object type found with type id: '${typeId}'`, context})
    }

    if (!item) {
      console.error(`[SERVE] No item found with item id: '${itemId}'`)
      return res.status(404).json({status: 404, error: `No item found with object and item id: '${typeId}', ${itemId}'`, context})
    }

    res.send(templateFn(item))
  }

  return serve
}

module.exports = configure
