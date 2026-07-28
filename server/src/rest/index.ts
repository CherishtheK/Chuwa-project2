import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth";
import { upload } from "./multer";
import * as ctrl from "./document.controller";

const router = Router();

router.post("/upload", requireAuth, upload.single("file"), ctrl.uploadDocument);
router.get("/files/:id", requireAuth, ctrl.serveFile);
router.get("/templates/:name", requireAuth, ctrl.downloadTemplate);

export default router;
