import { Request, Response } from "express";
import passport from "passport";
import { AuthService } from "../services/auth.service";

export class AuthController {
  static googleAuth(req: Request, res: Response) {
    passport.authenticate("google", {
      scope: ["profile", "email"],
      session: false,
    })(req, res);
  }

  static googleAuthCallback(req: Request, res: Response) {
    passport.authenticate(
      "google",
      { session: false },
      (err: Error, user: any) => {
        if (err || !user) {
          return res.redirect(
            `${process.env.FRONTEND_URL}/login?error=auth_failed`
          );
        }

        const token = AuthService.generateToken(user);

        res.redirect(
          `${process.env.FRONTEND_URL}/auth/callback?token=${token}`
        );
      }
    )(req, res);
  }

  static async getCurrentUser(req: Request, res: Response) {
    try {
      const user = (req as any).user;

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const { _id, email, name, photo, role } = user;

      // Ambil API keys yang dimiliki user berdasarkan relasi userId
      const { connectMongo } = await import("../config/mongo");
      const db = await connectMongo();
      const apiKeys = await db
        .collection("api_keys")
        .find({ userId: _id })
        .toArray();

      res.json({
        success: true,
        user: { _id, email, name, photo, role },
        apiKeys: apiKeys.map((k) => ({
          _id: k._id,
          key: k.key,
          createdAt: k.createdAt,
        })),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }

  static logout(req: Request, res: Response) {
    res.json({
      success: true,
      message: "Logged out successfully",
    });
  }
}
