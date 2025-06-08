// utils/mongo.ts
import { MongoClient, Collection } from "mongodb";

const uri = process.env.MONGODB_URI!;
const dbName = "healthcare_app"; // Replace with actual DB name
const collectionName = "healthcare_chat_history";

let client: MongoClient | null = null;

export async function getChatHistoryCollection(): Promise<Collection> {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
    console.log("mongoDb connected!")
  }

  const db = client.db(dbName);
  return db.collection(collectionName);
}
