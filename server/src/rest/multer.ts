import multer from "multer";
import path from "node:path";
import crypto from "node:crypto";
import fs from "node:fs";
import { Request, Response, NextFunction } from "express";

export const uploadDir = path.resolve(__dirname, "../../uploads");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, crypto.randomBytes(16).toString("hex") + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = [".pdf", ".jpg", ".jpeg", ".png"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF and images are allowed"));
    }
  },
});

export function uploadSingleFile(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  upload.single("file")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: err.message });
    }
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}
