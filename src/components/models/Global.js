const API = '/api/global'

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

  update() {
    const self = this
    fetch(API)
      .then(response => response.json())
      .then(data => self.record(data))
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
