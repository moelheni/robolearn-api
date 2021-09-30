const express = require('express')
var bodyParser = require('body-parser')
var cors = require('cors')

const app = express()
const port = 3000

const { MongoClient } = require('mongodb');

const url = "mongodb+srv://test:test@cluster0.wrcye.mongodb.net/kids?retryWrites=true&w=majority";
const dbName = "kids"

const client = new MongoClient(url);

app.use(bodyParser.json())
app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/users', async (req, res) => {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection('users');

  const { identifiant } = req.body

  const user = await collection.findOne({ identifiant })

  if (user) {
    res.send(user)
  } else {
    
    await collection.insertOne(req.body)
    const user = await collection.findOne({ identifiant })
    res.send(user)
  }
})

app.post('/users-url', async (req, res) => {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection('users');

  await collection.updateOne({
    identifiant: req.body.identifiant
  }, {
    $set: {
      url: req.body.url
    }
  })

  res.send('done')
})

app.post('/users-input', async (req, res) => {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection('users');

  const { identifiant, phase, id, data } = req.body

  const path = (`${phase}.${(''+id)}`).replace(/ /g, '_').replace(/-/g, '_').replace(/\//g, '.')
  console.log({ identifiant ,path })

  await collection.updateOne({
    identifiant
  }, {
    $set: {
      [path]: data
    }
  })

  res.send('done')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
