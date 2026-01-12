import { Request, Response } from "express";
import { GetAll, loginWithGoogle } from "../services/auth.service";
import jwt from "jsonwebtoken";

export function googleCallback(req: Request, res: Response) {
  res.json({
    message: "Login success",
    user: req.user,
  });
}

// Handle Google token from frontend
export async function googleTokenAuth(req: Request, res: Response) {
  try {
    const { token: googleToken, email } = req.body;

    if (!googleToken) {
      return res.status(400).json({
        message: "Google token is required",
      });
    }

    // For demo purposes, we'll create a mock Google profile
    // In production, you should verify the Google token with Google's API
    // Use email from request if provided, otherwise use demo email
    const userEmail = email || "demo@example.com";

    const mockProfile = {
      emails: [{ value: userEmail }],
      displayName: "Demo User", // This will be overwritten if user exists in DB
      photos: [{ value: "https://via.placeholder.com/150" }], // This will be overwritten if user exists in DB
      id: "google_" + Date.now(),
    };

    // Use the existing loginWithGoogle service to save user and create API key
    const { user, apiKeys } = await loginWithGoogle(mockProfile);

    // Return the API key as token (this is what the frontend expects)
    const apiKey = apiKeys && apiKeys.length > 0 ? apiKeys[0].key : null;

    res.status(200).json({
      token: apiKey,
      user: {
        name: user.name,
        email: user.email,
        picture: user.photo,
      },
    });
  } catch (error) {
    console.error("Google token auth error:", error);
    res.status(500).json({
      message: "Authentication failed",
    });
  }
}

export async function getAllUsers(req: Request, res: Response) {
  try {
    const users = await GetAll();

    res.status(200).json({
      message: "Users found",
      total: users.length,
      users: users,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch users",
    });
  }
}
