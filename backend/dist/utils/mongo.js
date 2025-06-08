// utils/mongo.ts
import { MongoClient } from "mongodb";
const uri = process.env.MONGODB_URI;
const dbName = "healthcare_app"; // Replace with actual DB name
const collectionName = "healthcare_chat_history";
let client = null;
export async function getChatHistoryCollection() {
    if (!client) {
        client = new MongoClient(uri);
        await client.connect();
        console.log("mongoDb connected!");
    }
    const db = client.db(dbName);
    return db.collection(collectionName);
}
