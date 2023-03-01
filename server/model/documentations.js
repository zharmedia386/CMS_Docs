const { MongoClient } = require("mongodb")

const connectionString = process.env.MONGO_URI

const documentationDB = async () => {
    try {
        const client = await MongoClient.connect(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log(client)
        console.log("\n\n\n");
        console.log(client.db('cms_docs'));
        return client.db('cms_docs').collection('documentations')
    } catch (err) {
        console.error('Error connecting to MongoDB: ', err);
        setTimeout(documentationDB, 5000);
    }
}

module.exports = documentationDB