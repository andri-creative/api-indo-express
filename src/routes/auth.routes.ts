import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  getAllUsers,
  getUserById,
  deleteUser,
} from "../controllers/getAuth.controller";

const router = Router();

// Public routes
router.get("/google", AuthController.googleAuth);
router.get("/google/callback", AuthController.googleAuthCallback);

// Protected routes
router.get("/me", authMiddleware, AuthController.getCurrentUser);
router.post("/logout", authMiddleware, AuthController.logout);

// Admin routes - Get all users with their API keys
router.get("/all", getAllUsers);

// Admin routes - Get user by ID with API keys
router.get("/:id", getUserById);

// Admin routes - Delete user and all their API keys
router.delete("/:id", deleteUser);

export default router;
