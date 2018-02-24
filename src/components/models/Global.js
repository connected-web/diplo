const READ_API = '/api/global'
const SAVE_API = '/api/save'

function notify(callbacks, data) {
  callbacks.forEach(cb => cb(data))
}

class GlobalModel {
  constructor() {
    this.state = {}
    this.callbacks = []
  }

  record(data) {
    this.state = data
    notify(this.callbacks, this.state)
  }

  async save(payload) {
    const result = await fetch(SAVE_API, {
      method: 'POST',
      headers: new Headers({'Content-type': 'application/json'}),
      body: JSON.stringify(payload)
    })

    this.update()

    return result
  }

  update() {
    const self = this
    fetch(READ_API)
      .then(response => response.json())
      .then(data => {
        self.record(data)
      })
      .catch(ex => console.error(ex))
  }

  listen(cb) {
    if(typeof cb === 'function') {
      this.callbacks.push(cb)
    }
  }

  get data() {
    return this.state
  }
}


export default GlobalModel
