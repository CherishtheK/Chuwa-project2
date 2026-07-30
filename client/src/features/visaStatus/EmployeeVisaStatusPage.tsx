import { useRef, useState } from "react";
import { useQuery } from "@apollo/client/react";
import StatusBadge from "../../components/StatusBadge";
import { previewFile, downloadFile } from "../../utils/fileHelper";
import { MY_VISA_STATUS } from "./graphql/visaQueries";
import axios from "axios";

const LABELS: Record<string, string> = {
  OPT_RECEIPT: "OPT Receipt",
  OPT_EAD: "OPT EAD",
  I983: "I-983",
  I20: "I-20",
};

export default function EmployeeVisaStatusPage() {
  const { data, loading, error, refetch } = useQuery(MY_VISA_STATUS);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleUpload = async (file: File | undefined, type: string) => {
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("type", type);
      const token = localStorage.getItem("token");
      await axios.post("/api/upload", form, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      await refetch();
    } catch (e) {
      const msg = axios.isAxiosError(e) ? e.response?.data?.error : null;
      setUploadError(msg ?? "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  if (loading) return <p className="text-gray-500">Loading…</p>;
  if (error) return <p className="text-danger">Error: {error.message}</p>;
  if (!data) return null;
  const { steps, nextStep, uploadableType, isOpt } = data.myVisaStatus;
  if (!isOpt)
    return (
      <p className="text-gray-500">
        This page only applies to F1 (OPT) visa holders.
      </p>
    );

  const currentIdx = steps.findIndex((s) => s.status !== "APPROVED");
  const current = currentIdx !== -1 ? steps[currentIdx] : null;
  const doc = current?.document;

  return (
    <>
      <h1>OPT Document Tracker</h1>
      <p className="mt-1 text-gray-500">
        Upload each document in order. The next unlocks once HR approves the
        current one.
      </p>
      {/* 进度条 */}
      <div className="mt-8 flex items-center">
        {steps.map((s, i) => (
          <div key={s.type} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center">
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold
                ${s.status === "APPROVED" ? "bg-success text-white" : i === currentIdx ? "bg-amber-500 text-white" : "bg-gray-200 text-gray-500"}`}
              >
                {s.status === "APPROVED" ? "✓" : i + 1}
              </span>
              <span className="mt-2 text-xs font-semibold">
                {LABELS[s.type]}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`mx-3 mb-5 h-0.5 flex-1 ${s.status === "APPROVED" ? "bg-success" : "bg-gray-200"}`}
              />
            )}
          </div>
        ))}
      </div>
      {/* 全部完成 */}
      {currentIdx === -1 && (
        <div className="mt-8 flex items-center gap-3 rounded-xl bg-white p-6 shadow-sm">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-50 text-success">
            ✓
          </span>
          <p className="font-semibold">{nextStep}</p>
        </div>
      )}
      {/* 当前step */}
      {currentIdx !== -1 && (
        <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold">
                Step {currentIdx + 1} · {LABELS[steps[currentIdx].type]}
              </h2>
            </div>
            <StatusBadge
              status={
                steps[currentIdx].status === "PENDING"
                  ? "PENDING"
                  : steps[currentIdx].status
              }
            />
          </div>
          <p className="mt-3 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-700">
            {nextStep}
          </p>
          {steps[currentIdx].feedback && (
            <p className="mt-3 rounded-lg bg-red-50 px-4 py-3 text-sm text-danger">
              HR feedback: {steps[currentIdx].feedback}
            </p>
          )}
          {steps[currentIdx].type === "I983" && (
            <div className="mt-3 flex gap-3">
              <button
                className="rounded-lg border px-4 py-2 text-sm font-semibold"
                onClick={() =>
                  downloadFile(
                    "/api/templates/i983-empty.pdf",
                    "i983-empty.pdf",
                  )
                }
              >
                ⬇ Empty Template
              </button>
              <button
                className="rounded-lg border px-4 py-2 text-sm font-semibold"
                onClick={() =>
                  downloadFile(
                    "/api/templates/i983-sample.pdf",
                    "i983-sample.pdf",
                  )
                }
              >
                ⬇ Sample Template
              </button>
            </div>
          )}
          {steps[currentIdx].document && (
            <div className="mt-3 flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="text-sm font-semibold">
                  {steps[currentIdx].document.filename}
                </p>
                <p className="text-xs text-gray-500">
                  Uploaded{" "}
                  {new Date(
                    steps[currentIdx].document!.uploadedAt,
                  ).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-4 text-sm font-semibold text-primary">
                <button onClick={() => previewFile(doc!.url)}>Preview</button>
                <button onClick={() => downloadFile(doc!.url, doc!.filename)}>
                  Download
                </button>
              </div>
            </div>
          )}

          {uploadableType === steps[currentIdx].type && (
            <>
              <input
                ref={fileRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) =>
                  handleUpload(e.target.files?.[0], steps[currentIdx].type)
                }
              />
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="mt-4 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                {uploading
                  ? "Uploading…"
                  : `Upload ${LABELS[steps[currentIdx].type]}`}
              </button>
              {uploadError && (
                <p className="mt-2 text-sm text-danger">{uploadError}</p>
              )}
            </>
          )}
        </div>
      )}
      {/* 已完成step */}
      {steps
        .filter((s) => s.status === "APPROVED")
        .map((s, i) => (
          <div
            key={s.type}
            className="mt-4 flex items-center justify-between rounded-xl bg-white p-5 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green-50 text-sm text-success">
                ✓
              </span>
              <div>
                <p className="text-sm font-bold">
                  Step {i + 1} · {LABELS[s.type]}
                </p>
                <p className="text-xs text-success">Approved by HR</p>
              </div>
            </div>
            <button
              className="text-sm font-semibold text-primary"
              onClick={() => s.document && previewFile(s.document.url)}
            >
              View
            </button>
          </div>
        ))}
    </>
  );
}
