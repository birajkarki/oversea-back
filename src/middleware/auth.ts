import { Request, Response, NextFunction } from "express";
import { prisma } from "../utils/prisma";
import { verifyToken } from "../utils/bcrypt";

export const isValidUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Missing or malformed token" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Missing or malformed token" });
    }

    const isValid = verifyToken(token);

    if (!isValid) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    return next();
  } catch (error: any) {
    console.error("Auth Middleware Error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
