import { MongoClient, MongoClientOptions, Db } from "mongodb";

const uri = process.env.MONGODB_URI as string;

if (!uri) {
  throw new Error("❌ MONGODB_URI tidak ditemukan di .env");
}

const options: MongoClientOptions = {
  appName: "express-ts-api",
};

let client: MongoClient;
let db: Db;

export async function connectMongo(): Promise<Db> {
  if (db) return db;

  client = new MongoClient(uri, options);
  await client.connect();

  db = client.db(process.env.DB_NAME);
  console.log("✅ MongoDB connected");

  return db;
}
