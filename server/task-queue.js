const queue = []
let workingOnTask = false

function add(task, id) {
  if (typeof next === 'function') {
    queue.push(next)
  }
  else {
    console.log('[TASK QUEUE] Unable to queue task; not a function')
  }

  if (!workingOnTask) {
    processQueue()
  }
}

async function processQueue() {
  if (queue.length < 0) {
    return
  }

  const next = queue.shift()
  workingOnTask = true
  try {
    await next()
    workingOnTask = false
  }
  catch(ex) {
    console.error('[TASK QUEUE] Unable to process task;', ex)
  }
  setTimeout(processQueue, 0)
}

module.exports = {
  add
}
