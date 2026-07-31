import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import ApprovalActionBar from "../../components/ApprovalActionBar";
import { previewFile, downloadFile } from "../../utils/fileHelper";
import StatusBadge from "../../components/StatusBadge";
import {
  VISA_EMPLOYEES,
  REVIEW_DOCUMENT,
  SEND_NOTIFICATION,
} from "./graphql/visaQueries";

export default function HRVisaStatusPage() {
  const [tab, setTab] = useState<"inProgress" | "all">("inProgress");
  const [search, setSearch] = useState("");
  const { data, loading, error, refetch } = useQuery(VISA_EMPLOYEES, {
    variables: {
      search: search || undefined,
      inProgressOnly: tab === "inProgress",
    },
  });
  const [reviewDoc, { loading: reviewing }] = useMutation(REVIEW_DOCUMENT);
  const [notify] = useMutation(SEND_NOTIFICATION);
  const [notifiedId, setNotifiedId] = useState<string | null>(null);

  if (error) return <p className="text-danger">Error: {error.message}</p>;
  const rows = data?.visaEmployees ?? [];

  const resultLabel = !search
    ? null
    : rows.length === 0
      ? "No records found"
      : rows.length === 1
        ? "1 record found"
        : `${rows.length} records found`;

  const handleReview =
    (documentId: string) =>
    async (decision: "APPROVE" | "REJECT", feedback: string) => {
      const res = await reviewDoc({
        variables: {
          documentId,
          decision,
          ...(decision === "REJECT" ? { feedback } : {}),
        },
      });
      if (res.data?.reviewDocument.success) await refetch();
      else alert(res.data?.reviewDocument.message ?? "Review failed");
    };

  const handleNotify = async (userId: string) => {
    const res = await notify({ variables: { userId } });
    if (res.data?.sendNotification.success) setNotifiedId(userId);
    else alert(res.data?.sendNotification.message ?? "Failed to send");
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h1>Visa Status Management</h1>
        <div className="flex rounded-lg bg-gray-100 p-1 text-sm">
          <button
            onClick={() => setTab("inProgress")}
            className={`rounded-md px-4 py-1.5 font-semibold ${tab === "inProgress" ? "bg-white text-primary shadow-sm" : "text-gray-700"}`}
          >
            In Progress
          </button>
          <button
            onClick={() => setTab("all")}
            className={`rounded-md px-4 py-1.5 font-semibold ${tab === "all" ? "bg-white text-primary shadow-sm" : "text-gray-700"}`}
          >
            All
          </button>
        </div>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by first, last, or preferred name…"
        className="mt-4 w-80 rounded-lg border bg-white px-4 py-2 text-sm"
      />
      {resultLabel && (
        <p className="mt-2 text-sm text-gray-500">{resultLabel}</p>
      )}
      {loading && <p className="mt-4 text-gray-500">Loading…</p>}

      {rows.map((r) => (
        <div key={r.userId} className="mt-5 rounded-xl bg-white p-6 shadow-sm">
          {tab === "inProgress" ? (
            <div
              className="grid gap-6 lg:grid-cols-[1fr_2fr]
"
            >
              {/* ── 左侧信息摘要 ── */}
              <div className="lg:border-r lg:pr-6">
                <p className="font-bold">{r.fullName}</p>
                <p className="text-sm text-gray-500">{r.email}</p>
                <dl className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Work auth.</dt>
                    <dd className="font-semibold">F1 (OPT)</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Start – End</dt>
                    <dd className="font-semibold">
                      {r.visaStartDate?.slice(0, 10)} –{" "}
                      {r.visaEndDate?.slice(0, 10)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Days remaining</dt>
                    <dd
                      className={`font-semibold ${r.daysRemaining !== null && r.daysRemaining < 90 ? "text-danger" : "text-success"}`}
                    >
                      {r.daysRemaining ?? "—"}
                    </dd>
                  </div>
                </dl>
                <div className="mt-4 rounded-lg bg-gray-50 p-3">
                  <p className="text-xs text-gray-500">Next step</p>
                  <p className="mt-0.5 text-sm font-semibold text-primary">
                    {r.nextStep}
                  </p>
                </div>
              </div>

              {/* ── 右侧审批区 ── */}
              {r.pendingDocument ? (
                <div>
                  <div className="flex items-center justify-between">
                    <p className="font-bold">
                      Document awaiting review ·{" "}
                      {r.pendingDocument.type.replace(/_/g, " ")}
                    </p>
                    <StatusBadge status="NEEDS_ACTION" />
                  </div>
                  <div className="mt-3 flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <p className="text-sm font-semibold">
                        {r.pendingDocument.filename}
                      </p>
                      <p className="text-xs text-gray-500">
                        Uploaded{" "}
                        {new Date(
                          r.pendingDocument.uploadedAt,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      className="text-sm font-semibold text-primary"
                      onClick={() => previewFile(r.pendingDocument!.url)}
                    >
                      Preview in browser ↗
                    </button>
                  </div>
                  <ApprovalActionBar
                    onSubmit={handleReview(r.pendingDocument.id)}
                    loading={reviewing}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    Next step:{" "}
                    <span className="font-semibold text-gray-900">
                      {r.nextStep}
                    </span>
                  </p>
                  <button
                    onClick={() => handleNotify(r.userId)}
                    disabled={notifiedId === r.userId}
                    className="rounded-lg border px-4 py-2 text-sm font-semibold text-primary disabled:opacity-50"
                  >
                    {notifiedId === r.userId
                      ? "✓ Notification sent"
                      : "✉ Send notification"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-bold">{r.fullName}</p>
                  <p className="text-sm text-gray-500">
                    F1 (OPT) · {r.visaStartDate?.slice(0, 10)} –{" "}
                    {r.visaEndDate?.slice(0, 10)} ·{" "}
                    <span
                      className={
                        r.daysRemaining !== null && r.daysRemaining < 90
                          ? "text-danger"
                          : "text-success"
                      }
                    >
                      {r.daysRemaining ?? "—"} days remaining
                    </span>
                  </p>
                </div>
                <p className="text-sm text-gray-500">
                  Next step:{" "}
                  <span className="font-semibold text-primary">
                    {r.nextStep}
                  </span>
                </p>
              </div>

              <div className="mt-4 divide-y">
                {r.documents
                  .filter((d) => d.status === "APPROVED")
                  .map((d) => (
                    <div
                      key={d.id}
                      className="flex items-center justify-between py-2.5"
                    >
                      <div>
                        <p className="text-sm font-semibold">
                          {d.type.replace(/_/g, " ")}
                        </p>
                        <p className="text-xs text-gray-500">{d.filename}</p>
                      </div>
                      <div className="flex gap-3 text-sm font-semibold text-primary">
                        <button onClick={() => previewFile(d.url)}>
                          Preview
                        </button>
                        <button onClick={() => downloadFile(d.url, d.filename)}>
                          Download
                        </button>
                      </div>
                    </div>
                  ))}
                {r.documents.filter((d) => d.status === "APPROVED").length ===
                  0 && (
                  <p className="py-3 text-sm text-gray-400">
                    No approved documents yet.
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      ))}

      {!loading && rows.length === 0 && (
        <p className="mt-8 text-center text-gray-400">
          {tab === "inProgress"
            ? "No employees with in-progress documents."
            : "No OPT employees found."}
        </p>
      )}
    </>
  );
}
