const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const { MongoClient } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9wgmh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const app = express();
app.use(bodyParser.json());
app.use(cors());
const port = 4000;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const productsCollection = client.db("emaJohnStore").collection("products");

  app.post("/addProduct", (req, res) => {
    const products = req.body;
    productsCollection.insertMany(products).then((result) => {
      result.send(result.insertedCount);
    });
  });

  app.get("/products", (req, res) => {
    productsCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.get("/product/:key", (req, res) => {
    productsCollection
      .find({ key: req.params.key })
      .toArray((err, documents) => {
        res.send(documents[0]);
      });
  });
});

app.listen(port);
