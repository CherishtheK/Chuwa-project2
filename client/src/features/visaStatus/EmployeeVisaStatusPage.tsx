import StatusBadge from "../../components/StatusBadge";
const MOCK = {
  isOpt: true,
  nextStep: "Waiting for HR to approve your OPT EAD",
  uploadableType: null as string | null,
  steps: [
    {
      type: "OPT_RECEIPT",
      status: "APPROVED",
      feedback: null,
      document: { id: "1", filename: "receipt.pdf", url: "/api/files/1" },
    },
    {
      type: "OPT_EAD",
      status: "PENDING",
      feedback: null,
      document: { id: "2", filename: "ead.pdf", url: "/api/files/2" },
    },
    { type: "I983", status: "NOT_UPLOADED", feedback: null, document: null },
    { type: "I20", status: "NOT_UPLOADED", feedback: null, document: null },
  ],
};
const LABELS: Record<string, string> = {
  OPT_RECEIPT: "OPT Receipt",
  OPT_EAD: "OPT EAD",
  I983: "I-983",
  I20: "I-20",
};

export default function EmployeeVisaStatusPage() {
  const { steps, nextStep, uploadableType } = MOCK; // TODO: useQuery(MY_VISA_STATUS)
  const currentIdx = steps.findIndex((s) => s.status !== "APPROVED");

  return (
    <>
      <h1>OPT Document Tracker</h1>
      <p className="mt-1 text-gray-500">
        Upload each document in order. The next unlocks once HR approves the
        current one.
      </p>
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
          {steps[currentIdx].document && (
            <div className="mt-3 flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="text-sm font-semibold">
                  {steps[currentIdx].document.filename}
                </p>
                <p className="text-xs text-gray-500">
                  Uploaded Jul 18, 2026 · 188 KB
                </p>
                {/* TODO: 真数据用 document.uploadedAt 格式化 + fileSize 换算 KB */}
              </div>
              <div className="flex gap-4 text-sm font-semibold text-primary">
                <button>Preview</button>
                <button>Download</button>
                {/* TODO: blob util —— preview 不带参数，download 加 ?download=1 */}
              </div>
            </div>
          )}

          {uploadableType === steps[currentIdx].type && (
            <button className="mt-4 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white">
              Upload {LABELS[steps[currentIdx].type]}
              {/* TODO: <input type=file hidden> → POST /api/upload */}
            </button>
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
            <button className="text-sm font-semibold text-primary">View</button>
          </div>
        ))}
    </>
  );
}
