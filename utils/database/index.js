const config = require("../config.json");
const { MongoClient } = require("mongodb");

const mongoClient = new MongoClient(config.database.mongo);

async function connect() {
    await mongoClient.connect()
}

const database = mongoClient.db(config.database.collection)

module.exports.database = database
module.exports.connect = connect