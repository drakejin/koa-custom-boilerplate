const https = require('axios')

exports.handler = (event, context, callback) => {
  const req = https.request(event.options, (res) => {
    let body = ''
    console.log('Status:', res.statusCode)
    console.log('Headers:', JSON.stringify(res.headers))
    res.setEncoding('utf8')
    res.on('data', (chunk) => { return body += chunk })
    res.on('end', () => {
      console.log('Successfully processed HTTPS response')
      // If we know it's JSON, parse it
      if (res.headers['content-type'] === 'application/json') {
        body = JSON.parse(body)
      }
      callback(null, body)
    })
  })
  req.on('error', callback)
  req.write(JSON.stringify(event.data))
  req.end()
}
