const express = require('express');
const cors = require('cors');
const {
    MongoClient,
    ServerApiVersion,
    ObjectId
} = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

// middle ware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dq5st.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1
});
// console.log(uri);

async function run() {
    try {
        await client.connect();
        const productsCollection = client.db('fruitsServer').collection('products');

        app.get('/products', async (req, res) => {
            const query = {};
            const cursor = productsCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        });

        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)
            };
            const product = await productsCollection.findOne(query);
            res.send(product);
        });
        //   POST
        app.post('/product', async (req, res) => {
            const newService = req.body;
            const result = await productsCollection.insertOne(newService);
            res.send(result);
        });
        // DELETE
        app.delete('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = {
                _id: ObjectId(id)
            };
            const result = await productsCollection.deleteOne(query);
            res.send(result);
        })

        //updating stock by using update stock button
            app.put('/updatestock/:id', async (req, res) =>{
            const id =  req.params.id; 
            const updateInfo=req.body;
            const filter={_id: ObjectId(id) };
            const options = {upsert: true };
            const updatedDoc = {
            $set:{
            quantity: updateInfo.quantity,
            sold: updateInfo.sold
            }
        }
            const result=await productsCollection.updateOne (filter, updatedDoc, options);
            res.send(result);
            })

            // handleSoldUpdate
            app.put('/updatesold/:id', async (req, res) =>{
                const id =  req.params.id; 
                const updateInfo=req.body;
                const filter={_id: ObjectId(id) };
                const options = {upsert: true };
                const updatedDoc = {
                $set:{
                sold: updateInfo.sold
                }
            }
                const result=await productsCollection.updateOne (filter, updatedDoc, options);
                res.send(result);
                })


                app.get('/my-item', async( req, res) => {
                    const email = req.query.email;
                    const query = {email:email};
                    const result = await productsCollection.find(query).toArray()
                    res.json(result)
                })



    } finally {


    }
}

run().catch(console.dir);


app.get('/', async (req, res) => {
    res.send('Running fruits server');
});

app.listen(port, () => {
    console.log('listing to port', port);
});

