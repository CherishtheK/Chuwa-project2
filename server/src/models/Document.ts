import mongoose, { Schema, Document, Types } from "mongoose";

const DOC_TYPES = [
  "PROFILE_PICTURE",
  "DRIVERS_LICENSE",
  "WORK_AUTHORIZATION",
  "OPT_RECEIPT",
  "OPT_EAD",
  "I983",
  "I20",
] as const;
export interface IDocument extends Document {
  owner: Types.ObjectId;
  type: (typeof DOC_TYPES)[number];
  filename: string;
  storedName: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  feedback?: string;
  mimeType: string;
  fileSize: number;
}

const documentSchema = new Schema<IDocument>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: DOC_TYPES,
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
    storedName: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
      required: true,
    },
    feedback: {
      type: String,
    },
    mimeType: { type: String, required: true },
    fileSize: { type: Number, required: true },
  },
  { timestamps: true },
);

export const DocumentModel = mongoose.model<IDocument>(
  "Document",
  documentSchema,
);
