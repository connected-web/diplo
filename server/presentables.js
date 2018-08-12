let lastUpdate = Date.now()
let delayWorker

function regenerate(model) {
  const timeSinceLastUpdate = Date.now() - lastUpdate
  if (timeSinceLastUpdate < 1000) {
    clearTimeout(delayWorker)
    delayWorker = setTimeout(worker, timeSinceLastUpdate, model)
  } else {
    worker(model)
  }
}

function worker(model) {
    while(model.presentables.length > 0) {
      model.presentables.pop()
    }

    model.templates.forEach(template => {
      const templateId = template.templateId
      const objectType = template.objectType
      const items = model.objects.filter(object => object.id === objectType)[0].items
      items.forEach(item => {
        const itemId = item.id
        const presentable = {
          objectType,
          templateId,
          itemId,
          assetId: `${objectType}-${templateId}-${itemId}`
        }
        model.presentables.push(presentable)
      })
    })

    console.log('[Presentables] Regenerating: ', model.presentables.length, '; total across', model.objects.length, 'types')
    lastUpdate = Date.now()
}

module.exports = { regenerate }
