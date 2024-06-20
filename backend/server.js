const express = require('express');
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');
const bodyparser = require('body-parser');
const cors = require('cors');

dotenv.config();
// console.log(process.env)

// Connection URL
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);
client.connect(); 

 // Database Name
const dbName = 'passop';

const app = express();
const port = 3000;

// Middleware
app.use(bodyparser.json());
app.use(cors());



// Getting all the passwords
app.get('/', async (req, res) => {
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.find({}).toArray();
    res.json(findResult)
})

// Saving a password
app.post('/', async (req, res) => {
    const password = req.body;
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.insertOne(password);
    res.send({success: true, result: findResult})
})

// Deleting a password by id
app.delete('/',async (req,res)=>{
    const { id } = req.body
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.deleteOne({ id })
    res.send({success:true, result:findResult})
})

// Updating a password
app.put('/update',async(req,res)=>{
    const { id, site, username, password} = req.body;
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.updateOne({id}, {$set:{site,username,password} });
    res.send({success:true, result: findResult})
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})