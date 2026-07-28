import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/auth";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  try {
    const payload = verifyToken(header.replace("Bearer ", ""));
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}
