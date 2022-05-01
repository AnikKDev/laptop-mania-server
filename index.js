const express = require('express')
const app = express()
const port = process.env.PORT || 5000;
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
// middleware
app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hekzg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const itemCollection = client.db("maniadb").collection("items");

        // get six items from inventory
        app.get('/inventory', async (req, res) => {
            // search all items
            const query = {};
            const cursor = itemCollection.find(query).limit(6);
            const result = await cursor.toArray();
            res.send(result);
        })

        // get all available items from inventory
        app.get('/manage-inventories', async (req, res) => {
            // search all items
            const query = {};
            const cursor = itemCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        // get a item by searching its id
        app.get('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await itemCollection.findOne(query);
            res.send(result);
        })

        // update item quantity (increament and decreament)
        app.put('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const updatedQuantity = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    quantity: updatedQuantity.newQuantity
                }
            };
            const result = await itemCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        });





        // delete a table item (from database too)
        app.delete('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await itemCollection.deleteOne(query);
            res.send(result);
        });


        // add items to inventory
        app.post('/manage-inventories', async (req, res) => {
            const newItem = req.body;
            const result = await itemCollection.insertOne(newItem);
            res.send(result);
        })


    } finally {

    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Server is connected to ${port}`)
});