import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth";
import { uploadSingleFile } from "./multer";
import * as docCtrl from "./documentController";

const router = Router();

router.post("/upload", requireAuth, uploadSingleFile, docCtrl.uploadDocument);
router.get("/files/:id", requireAuth, docCtrl.presentFile);
router.get("/templates/:name", requireAuth, docCtrl.downloadTemplate);

export default router;
