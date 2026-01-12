import { Request, Response } from "express";
import { GetAll, GetById, DeleteUser } from "../services/getAuth.service";

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

export async function getUserById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    // Validasi tipe id
    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const user = await GetById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User found",
      user: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
    });
  }
}

export async function deleteUser(req: Request, res: Response) {
  try {
    const { id } = req.params;

    // Validasi tipe id
    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const result = await DeleteUser(id);

    if (!result.success) {
      return res.status(404).json({
        success: false,
        message: result.message,
      });
    }

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
    });
  }
}
