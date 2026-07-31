import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import {
  VISA_EMPLOYEES,
  REVIEW_DOCUMENT,
  SEND_NOTIFICATION,
} from "./graphql/visaQueries";
import InProgressCard from "./components/InProgressCard";
import AllTabCard from "./components/AllTabCard";

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

      {rows.map((r) =>
        tab === "inProgress" ? (
          <InProgressCard
            key={r.userId}
            row={r}
            reviewing={reviewing}
            onReview={handleReview}
            notified={notifiedId === r.userId}
            onNotify={handleNotify}
          />
        ) : (
          <AllTabCard key={r.userId} row={r} />
        ),
      )}

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
