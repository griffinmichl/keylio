const path = require('path')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const PORT = process.env.PORT || 8080
const randomWords = require('random-words')
const db = require('./db/db')
const {
  incrementLetter,
  getAllLetters,
  incrementTransition,
  getAllTransitions,
} = require('./db/model')
const { median } = require('./util/util')
const { each: asyncEach } = require('async')

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

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, 'dist')))

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'))
})

app.post('/api/dwell', (req, res) => {
  const dwellData = req.body
  asyncEach(Object.keys(dwellData), (key, outercb) => {
    asyncEach(dwellData[key], (time, innercb) => {
      incrementLetter(key, time, innercb)
    }, (err) => {
      if (err) {
        console.log(err)
      } else {
        outercb()        
      }
    })

  }, (err) => {
    if (err) {
      res.sendStatus(500)
    } else {
      res.sendStatus(201)
    }
  }) 
})

app.post('/api/transition', (req, res) => {
  const dwellData = req.body
  asyncEach(Object.keys(dwellData), (from, outercb) => {
    asyncEach(Object.keys(dwellData[from]), (to, middlecb) => {
      asyncEach(dwellData[from][to], (time, innercb) => {
        incrementTransition(from, to, time, innercb)
      }, err => err ? console.log(err) : middlecb())
    }, err => err ? console.log(err) : outercb())
  }, (err) => {
    if (err) {
      res.sendStatus(500)
    } else {
      res.sendStatus(201)
    }
  }) 
})

app.get('/api/keyboard', (req, res) => {
  getAllLetters((err, result) => {
    const medians = Object.keys(result)
      .reduce((mediansObject, char) => {
        mediansObject[char] = median(result[char])
        return mediansObject
      }, {})

    if (err) {
      res.sendStatus(500)
    } else {
      res.status(200).send(medians)
    }
  })
})

app.get('/api/transition', (req, res) => {
  getAllTransitions((err, result) => {
    const medians = {}
    for (let fromKey in result) {
      for (let toKey in result[fromKey]) {
        medians[fromKey] = medians[fromKey] || {}
        medians[fromKey][toKey] = median(result[fromKey][toKey])
      }
    }

    if (err) {
      res.sendStatus(500)
    } else {
      res.status(200).send(medians)
    }
  })
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
        console.info("==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT)
      }
    })
  }
})
