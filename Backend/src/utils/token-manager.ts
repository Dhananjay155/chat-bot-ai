import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { COOKIE_NAME } from "./constants.js";

const JWT_SECRET = process.env.JWT_SECRET || "defaultSecretKey";

export const createToken = (
  id: string,
  email: string,
  expiresIn: string = "7d"
) => {
  const payload = { id, email };
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token = req.header("Authorization");

  if (!token || token.trim() === "") {
    return res.status(401).json({ message: "Token Not Received" });
  }

  if (token.startsWith("Bearer ")) {
    token = token.slice(7).trim();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.locals.jwtData = decoded;
    next();
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token Expired" });
    }
    return res.status(403).json({ message: "Invalid Token" });
  }
};
