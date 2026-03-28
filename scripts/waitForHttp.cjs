const http = require('node:http')

function waitFor(url, timeoutMs) {
  return new Promise((resolve, reject) => {
    const start = Date.now()

    const attempt = () => {
      const req = http.get(url, (res) => {
        res.resume()
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 500) {
          resolve(url)
          return
        }
        req.destroy()
        retry()
      })

      req.on('error', retry)

      function retry() {
        if (Date.now() - start > timeoutMs) {
          reject(new Error(`Timed out waiting for ${url}`))
          return
        }
        setTimeout(attempt, 200)
      }
    }

    attempt()
  })
}

module.exports = { waitFor }
