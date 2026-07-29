import { IDocument } from "../models/Document";

export const OPT_STEPS = ["OPT_RECEIPT", "OPT_EAD", "I983", "I20"] as const;
export type OptStep = (typeof OPT_STEPS)[number];

const STEP_LABELS: Record<OptStep, string> = {
  OPT_RECEIPT: "OPT Receipt",
  OPT_EAD: "OPT EAD",
  I983: "I-983",
  I20: "I-20",
};

const UPLOAD_PROMPTS: Record<OptStep, string> = {
  OPT_RECEIPT: "Please upload your OPT Receipt",
  OPT_EAD: "Please upload a copy of your OPT EAD",
  I983: "Please download and fill out the I-983 form",
  I20: "Please send the I-983 along with all necessary documents to your school and upload the new I-20",
};

export interface VisaStep {
  type: OptStep;
  status: "NOT_UPLOADED" | "PENDING" | "APPROVED" | "REJECTED";
  feedback: string | null;
  document: IDocument | null;
}

export interface VisaStatusResult {
  steps: VisaStep[];
  nextStep: string;
  uploadableType: OptStep | null;
}

export function computeVisaStatus(docs: IDocument[]): VisaStatusResult {
  //从一堆文件中找出美中文件最新create的doc

  const latestByType: Partial<Record<OptStep, IDocument>> = {};
  for (const d of docs) {
    const step = d.type as OptStep;
    if (!OPT_STEPS.includes(step)) continue;
    const existing = latestByType[step];
    if (!existing || d.createdAt > existing.createdAt) {
      latestByType[step] = d;
    }
  }

  // 给四种文件构造steps
  const steps: VisaStep[] = OPT_STEPS.map((type) => {
    const doc = latestByType[type] ?? null;
    return {
      type,
      status: doc ? doc.status : "NOT_UPLOADED",
      feedback: doc?.feedback ?? null,
      document: doc,
    };
  });

  // ── 找出第一个不是APPROVED，就是当前所在的step
  let nextStep = "All documents have been approved";
  let uploadableType: OptStep | null = null;
  for (const s of steps) {
    if (s.status === "APPROVED") continue;

    const label = STEP_LABELS[s.type];
    if (s.status === "NOT_UPLOADED") {
      uploadableType = s.type;
      nextStep = UPLOAD_PROMPTS[s.type];
    } else if (s.status === "PENDING") {
      uploadableType = null;
      nextStep = `Waiting for HR to approve your ${label}`;
    } else {
      uploadableType = s.type;
      nextStep = `Your ${label} was rejected. Please check the feedback and re-upload.`;
    }
    break;
  }

  return { steps, nextStep, uploadableType };
}
