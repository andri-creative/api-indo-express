import { connectMongo } from "../config/mongo";
import { ObjectId } from "mongodb";

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

export async function GetById(userId: string) {
  const db = await connectMongo();

  // Validasi ObjectId
  if (!ObjectId.isValid(userId)) {
    return null;
  }

  const user = await db
    .collection("users")
    .aggregate([
      {
        $match: { _id: new ObjectId(userId) },
      },
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
            _id: 1,
            key: 1,
            createdAt: 1,
          },
        },
      },
    ])
    .toArray();

  return user.length > 0 ? user[0] : null;
}

export async function DeleteUser(userId: string) {
  const db = await connectMongo();

  // Validasi ObjectId
  if (!ObjectId.isValid(userId)) {
    return { success: false, message: "Invalid user ID format" };
  }

  const objectId = new ObjectId(userId);

  // Cek apakah user ada
  const user = await db.collection("users").findOne({ _id: objectId });
  if (!user) {
    return { success: false, message: "User not found" };
  }

  // Hapus semua API keys milik user ini (relasi cascade)
  await db.collection("api_keys").deleteMany({ userId: objectId });

  // Hapus user
  const result = await db.collection("users").deleteOne({ _id: objectId });

  return {
    success: result.deletedCount > 0,
    message:
      result.deletedCount > 0
        ? "User deleted successfully"
        : "Failed to delete user",
  };
}
