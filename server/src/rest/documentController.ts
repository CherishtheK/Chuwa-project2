import { Request, Response } from "express";
import path from "node:path";
import fs from "node:fs";
import { DocumentModel, DOC_TYPES } from "../models/Document";
import { OPT_STEPS, computeVisaStatus } from "../services/visaStatus";
import { uploadDir } from "./multer";
import mongoose from "mongoose";

const templateDir = path.resolve(__dirname, "../../templates");
const TEMPLATES = ["i983-empty.pdf", "i983-sample.pdf"];

// POST /api/upload 上传文件
export async function uploadDocument(req: Request, res: Response) {
  const file = req.file;
  const type = req.body.type;
  const user = req.user!;

  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  if (!DOC_TYPES.includes(type)) {
    fs.rmSync(path.join(uploadDir, file.filename), { force: true });
    return res.status(400).json({ error: "Invalid document type" });
  }
  const LOCKED_STEP_TYPES = ["OPT_EAD", "I983", "I20"];
  if (LOCKED_STEP_TYPES.includes(type)) {
    const docs = await DocumentModel.find({ owner: user.userId });

    const { uploadableType } = computeVisaStatus(docs);
    if (uploadableType !== type) {
      fs.rmSync(path.join(uploadDir, file.filename), { force: true });
      return res
        .status(400)
        .json({ error: "You cannot upload this document yet" });
    }
  }

  let doc;
  try {
    doc = await DocumentModel.create({
      owner: user.userId,
      type,
      filename: file.originalname,
      storedName: file.filename,
      mimeType: file.mimetype,
      fileSize: file.size,
    });
  } catch (err) {
    fs.rmSync(path.join(uploadDir, file.filename), { force: true });
    throw err;
  }

  return res.status(201).json({
    id: doc._id,
    type: doc.type,
    filename: doc.filename,
    url: `/api/files/${doc._id}`,
    status: doc.status,
  });
}

// GET /api/files/:id 处理预览或者下载文件
export async function presentFile(req: Request, res: Response) {
  const user = req.user!;

  const isValidId = mongoose.isValidObjectId(req.params.id);
  if (!isValidId) return res.status(404).json({ error: "Document not found" });

  const doc = await DocumentModel.findById(req.params.id);
  if (!doc) return res.status(404).json({ error: "Document not found" });

  const isOwner = String(doc.owner) === user.userId;
  const isHR = user.role === "hr";
  if (!isOwner && !isHR)
    return res.status(403).json({
      error: "Not allowed",
    });
  const filePath = path.join(uploadDir, doc.storedName);
  if (!fs.existsSync(filePath))
    return res.status(404).json({ error: "File missing on disk" });

  res.setHeader("Content-Type", doc.mimeType);
  const disposition = req.query.download ? "attachment" : "inline";
  res.setHeader(
    "Content-Disposition",
    `${disposition}; filename="${encodeURIComponent(doc.filename)}"`,
  );
  return res.sendFile(filePath); //
}

// GET /api/templates/:name —— 下载templates
export function downloadTemplate(
  req: Request<{ name: string }>,
  res: Response,
) {
  if (!TEMPLATES.includes(req.params.name))
    return res.status(404).json({ error: "Unknown template" });
  return res.download(path.join(templateDir, req.params.name));
}
