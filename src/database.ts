import { MongoClient } from "mongodb";

const mongoClient = new MongoClient(process.env.MONGO_URI);
await mongoClient.connect();
const db = mongoClient.db(process.env.DATABASE_NAME);

export { mongoClient, db };
