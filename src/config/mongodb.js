import { MongoClient } from "mongodb";

let client;
export const connectToMongoDB = () => {
  MongoClient.connect(process.env.DB_URL)
    .then((clientInstace) => {
      client = clientInstace;
      console.log("Connected to MongoDB");
      createCounter(client.db());
      createIndexes(client.db());
    })
    .catch((error) => {
      console.error(error);
    });
};

export const getClient = () => {
  return client;
};

export const getDB = () => {
  return client.db();
};

const createCounter = async (db) => {
  const existingCounter = await db
    .collection("counters")
    .findOne({ _id: "cartItemId" });
  if (!existingCounter) {
    await db.collection("counters").insertOne({ _id: "cartItemId", value: 0 });
  }
};

const createIndexes = async (db) => {
  await db.collection("products").createIndex({ price: 1 });
  await db.collection("products").createIndex({ name: 1, category: -1 });
};
