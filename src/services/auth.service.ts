import { ObjectId } from "mongodb";
import { connectMongo } from "../config/mongo";
import { createApiKeyIfAllowed } from "./apiKey.service";

export async function loginWithGoogle(profile: any) {
  const db = await connectMongo();

  let user = await db.collection("users").findOne({
    email: profile.emails[0].value,
  });

  if (!user) {
    const newUser = {
      email: profile.emails[0].value,
      name: profile.displayName,
      provider: "google",
      photo: profile.photos?.[0]?.value,
      role: "user",
      createdAt: new Date(),
    };

    const result = await db.collection("users").insertOne(newUser);
    user = { ...newUser, _id: result.insertedId };
  }

  const apiKeys = await createApiKeyIfAllowed(user._id);

  return {
    user,
    apiKeys, // ⚠️ tampilkan SEKALI SAAT LOGIN
  };
}

export async function GetAll() {
  const db = await connectMongo();

  const users = await db
    .collection("users")
    .aggregate([
      {
        $lookup: {
          from: "api_keys",
          localField: "_id",
          foreignField: "userId",
          as: "apiKeys",
        },
      },
      {
        $project: {
          email: 1,
          name: 1,
          provider: 1,
          photo: 1,
          role: 1,
          createdAt: 1,
          apiKeys: {
            key: 1,
            createdAt: 1,
          },
        },
      },
    ])
    .toArray();

  return users;
}
