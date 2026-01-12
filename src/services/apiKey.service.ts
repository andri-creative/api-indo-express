import { ObjectId } from "mongodb";
import { connectMongo } from "../config/mongo";
import crypto from "crypto";

export async function createApiKeyIfAllowed(userId: ObjectId) {
  const db = await connectMongo();

  const apiKeys = await db.collection("api_keys").find({ userId }).toArray();

  if (apiKeys.length >= 1) {
    return apiKeys;
  }

  const key = Buffer.from(crypto.randomBytes(32).toString("hex")).toString(
    "base64"
  );

  await db.collection("api_keys").insertOne({
    key,
    userId,
    createdAt: new Date(),
  });

  return await db.collection("api_keys").find({ userId }).toArray();
}
