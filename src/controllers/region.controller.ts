import { Request, Response, NextFunction } from "express";
import {
  getProvinces,
  getRegenciesByProvince,
  getDistrictsByRegency,
  getVillagesByDistrict,
} from "../services/region.service";

export const provinces = (_: Request, res: Response, next: NextFunction) => {
  try {
    res.json({
      success: true,
      data: getProvinces(),
    });
  } catch (error) {
    next(error);
  }
};

export const regencies = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { province_code } = req.query;
    if (!province_code) {
      return res.status(400).json({
        success: false,
        message: "province_code is required",
      });
    }

    res.json({
      success: true,
      data: getRegenciesByProvince(province_code as string),
    });
  } catch (error) {
    next(error);
  }
};

export const districts = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { regency_code } = req.query;
    if (!regency_code) {
      return res.status(400).json({
        success: false,
        message: "regency_code is required",
      });
    }

    res.json({
      success: true,
      data: getDistrictsByRegency(regency_code as string),
    });
  } catch (error) {
    next(error);
  }
};

export const villages = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { district_code } = req.query;
    if (!district_code) {
      return res.status(400).json({
        success: false,
        message: "district_code is required",
      });
    }

    res.json({
      success: true,
      data: getVillagesByDistrict(district_code as string),
    });
  } catch (error) {
    next(error);
  }
};
