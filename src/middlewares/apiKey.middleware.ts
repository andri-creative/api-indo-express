import { Request, Response, NextFunction } from "express";
import { connectMongo } from "../config/mongo";

export async function apiKeyAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Authorization header required",
      });
    }

    // Format: Bearer <API_KEY>
    const [type, apiKey] = authHeader.split(" ");

    if (type !== "Bearer" || !apiKey) {
      return res.status(401).json({
        message: "Invalid authorization format",
      });
    }

    const db = await connectMongo();
    const keyDoc = await db.collection("api_keys").findOne({ key: apiKey });

    if (!keyDoc) {
      return res.status(403).json({
        message: "Invalid API key",
      });
    }

    // (opsional) inject userId ke request
    (req as any).userId = keyDoc.userId;

    next();
  } catch (error) {
    return res.status(500).json({
      message: "API key validation failed",
    });
  }
}
