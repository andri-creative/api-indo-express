import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { connectMongo } from "../config/mongo";
import { ObjectId } from "mongodb";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    // Verify token
    const decoded = AuthService.verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    // Get user from database
    const usersCollection = (await connectMongo()).collection("users");
    const user = await usersCollection.findOne({
      _id: new ObjectId(decoded._id),
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // Attach user to request
    (req as any).user = user;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Authentication error",
    });
  }
};
