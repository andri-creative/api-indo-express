import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import { connectMongo } from "../config/mongo";
import { createApiKeyIfAllowed } from "./apiKey.service";

export interface GoogleProfile {
  id: string;
  displayName: string;
  name: { givenName: string; familyName: string };
  emails: Array<{ value: string; verified: boolean }>;
  photos: Array<{ value: string }>;
}

export class AuthService {
  private static getJwtSecret(): jwt.Secret {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }
    return secret;
  }

  static generateToken(user: User): string {
    const payload = {
      _id: user._id?.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      photo: user.photo,
    };

    const secret = this.getJwtSecret();
    const expiresIn = process.env.JWT_EXPIRES_IN || "7d";

    return jwt.sign(payload, secret, {
      expiresIn: expiresIn as any,
    });
  }

  static async loginWithGoogle(profile: GoogleProfile): Promise<User> {
    const email = profile.emails[0].value;

    const usersCollection = (await connectMongo()).collection<User>("users");
    let user = await usersCollection.findOne({ email });

    if (!user) {
      // User baru - create user
      const newUser: User = {
        email,
        name: profile.displayName,
        provider: "google",
        photo: profile.photos[0]?.value,
        role: "user",
        createdAt: new Date(),
      };

      const result = await usersCollection.insertOne(newUser);
      user = { ...newUser, _id: result.insertedId };
    }

    // Auto-generate API key jika belum punya (maksimal 1 key per user)
    if (user._id) {
      await createApiKeyIfAllowed(user._id);
    }

    return user;
  }

  static verifyToken(token: string): any {
    try {
      const secret = this.getJwtSecret();
      return jwt.verify(token, secret);
    } catch (error) {
      return null;
    }
  }
}
