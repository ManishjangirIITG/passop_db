const express = require('express');
const dotenv = require('dotenv');
const { MongoClient, ServerApiVersion } = require('mongodb');
const bodyparser = require('body-parser');
const cors = require('cors');

dotenv.config();
// console.log(process.env)

// Connection URL
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
const dbName = process.env.DB_NAME
const app = express();
const port = 3000;

async function connectDB() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to the database:", error);
    }
}

// Database Name

// Middleware
app.use(bodyparser.json());
app.use(cors());

async function getPasswords() {
    try {
        const db = client.db(dbName);
        const collection = db.collection('passwords');
        const passwords = await collection.find({}).toArray();
        return passwords;
    } catch (error) {
        console.error("Error fetching passwords");
        return [];
    }
}

await connectDB();

// Getting all the passwords
app.get('/', async (req, res) => {
    try {
        const passwords = await getPasswords();
        res.json(passwords);
    } catch (error) {
        console.error("Error getting passwords:", error);
        res.status(500).json({ error: "Internal Server Error" })
    }
})

// Saving a password
app.post('/', async (req, res) => {
    try {
        const password = req.body;
        const db = client.db(dbName);
        const collection = db.collection('passwords');
        const findResult = await collection.insertOne(password);
        res.send({ success: true, result: findResult })
    }catch (error) {
        console.error('Error Saving password',error)
        res.status(500).json({error: "Internal Server Error"})
    }
})

// Deleting a password by id
app.delete('/', async (req, res) => {
    try {
        const password = req.body
        const db = client.db(dbName);
        const collection = db.collection('passwords');
        const findResult = await collection.deleteOne(password)
        res.send({ success: true, result: findResult })        
    } catch (error) {
        console.error('Error Deleting password',error)
        res.status(500).json({error: "Internal Server Error"})
    }
})

// Updating a password
app.put('/update', async (req, res) => {
    try {
        const { id, site, username, password } = req.body;
        const db = client.db(dbName);
        const collection = db.collection('passwords');
        const findResult = await collection.updateOne({ id }, { $set: { site, username, password } });
        res.send({ success: true, result: findResult })
    } catch (error) {
        console.error('Error Updating password',error)
        res.status(500).json({error: "Internal Server Error"})
    }
    
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

exports = {
    connectDB,getPasswords
}