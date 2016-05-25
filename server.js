const path = require('path')
const express = require('express')
const app = express()
const PORT = process.env.PORT || 8080
const randomWords = require('random-words')
const db = require('./db/db')
const { getLetter } = require('./db/model/dwell')


// using webpack-dev-server and middleware in development environment
if(process.env.NODE_ENV !== 'production') {
  const webpackDevMiddleware = require('webpack-dev-middleware')
  const webpackHotMiddleware = require('webpack-hot-middleware')
  const webpack = require('webpack')
  const config = require('./webpack.config')
  const compiler = webpack(config)

  app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }))
  app.use(webpackHotMiddleware(compiler))
}

app.use(express.static(path.join(__dirname, 'dist')))

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'))
})

app.post('/api/test', (req, res) => {
  let body
  req.on('data', (chunk) => {
    console.log('1')
    body += chunk
  })
  req.on('end', () => console.log(body))
})

app.get('/api/prompt', (req, res) => {
  const prompt = randomWords({ exactly: 50, join: ' ' })
  res.send(prompt)
})

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'))
})

db.connect(function(err) {
  if (err) {
    console.log('Unable to connect to Mongo.')
    process.exit(1)
  } else {
    app.listen(PORT, (error) => {
      if (error) {
        console.error(error)
      } else {
        getLetter('a', (e, r) => {
        console.log(e,r)
        console.info("==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT)
        })
      }
    })
  }
})
