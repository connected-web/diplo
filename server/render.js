const Nightmare = require('nightmare')

function render(url, filename) {
  return yield Nightmare()
    .goto(url)
    .screenshot(filename)
}

module.exports = render
