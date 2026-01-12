import { Router } from "express";
import {
  googleCallback,
  googleTokenAuth,
} from "../controllers/auth.controller";
import passport from "passport";
import { getAllUsers } from "../controllers/auth.controller";

const router = Router();

// POST endpoint for Google token authentication (from frontend)
router.post("/google", googleTokenAuth);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    res.json({ message: "Login success", user: req.user });
  }
);

router.get("/all", getAllUsers);

export default router;
