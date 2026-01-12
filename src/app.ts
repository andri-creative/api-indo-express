import "dotenv/config";

import express from "express";
import cors from "cors";
import path from "path";
import regionRoutes from "./routes/region.routes";
import authRoutes from "./routes/auth.routes";
import { connectMongo } from "./config/mongo";

import passport from "passport";

import "./config/passport";

const url = "/api/v1";

const app = express();

// middleware
app.use(
  cors({
    origin: "https://indonesia-creative.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(passport.initialize());
app.use("/api/v1/auth", authRoutes);

app.use(express.static(path.join(__dirname, "..")));
app.use(url, regionRoutes);

app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
);

// routes
app.get("/", async (req, res) => {
  try {
    const db = await connectMongo();

    const collections = await db.collections();

    res.json({
      data: {
        status: 200,
        version: "1.0.0",
        message: "Welcome to API Indonesia - Free Indonesian Data API",
        free: "API Indonesia",
        framework: "Express + TS + CORS",
        github: "https://github.com/andri-creative",
        author: "Andri Creative",
        database: {
          status: "connected",
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      data: {
        status: 500,
        message: "Database not connected",
      },
    });
  }
});

export default app;
