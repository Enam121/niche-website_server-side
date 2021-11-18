const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yatx1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
  try {
    await client.connect();

    const database = client.db("ex-watch");
    const productCollection = database.collection("products");
    const orderCollection = database.collection("orders");
    const reviewCollection = database.collection("reviews");


    // get api (get all products)
    app.get('/products', async (req, res) => {
      const cursor = productCollection.find({});
      const products = await cursor.toArray();
      res.send(products);
    });

    //get api (get single product by product name)
    app.get('/purchage/:name', async (req, res) => {
      const name = req.params.name;
      const query = { name: name };
      const result = await productCollection.findOne(query);
      res.send(result);
    });

    //get api (get user orders by email)
    app.get('/orders', async (req, res) => {
      const email = req.query.email;
      const query = { 'userInfo.email': email };
      const result = await orderCollection.find(query).toArray();
      console.log(result)
      res.send(result);
    });


    //post api (post user order)
    app.post('/orders', async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.json(result);
    });

    //post api (post users review)
    app.post('/review', async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      console.log(result)
      res.json(result);
    });

    //post api (add a single product to db)
    app.post('/products', async (req, res) => {
      const product = req.body;
      const result = await productCollection.insertOne(product);
      console.log(result);
      res.json(result);
    })

    //delete api (delete users order)
    app.delete('/delete/:name', async (req, res) => {
      const name = req.params.name;
      const query = { 'orderInfo.name': name };
      const result = await orderCollection.deleteOne(query);
      console.log(result)
      res.json(result);
    });




  }
  finally {

  }
}

run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('niche web-server is runnnnnnnning')
})


app.listen(port, () => {
  console.log('server run at port: ', port)
})