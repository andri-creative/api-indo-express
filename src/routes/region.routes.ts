import { Router } from "express";
import {
  provinces,
  regencies,
  districts,
  villages,
} from "../controllers/region.controller";
import { apiKeyAuth } from "../middlewares/apiKey.middleware";

const router = Router();

router.get("/provinces", apiKeyAuth, provinces);
router.get("/regencies", apiKeyAuth, regencies);
router.get("/districts", apiKeyAuth, districts);
router.get("/villages", apiKeyAuth, villages);

export default router;
