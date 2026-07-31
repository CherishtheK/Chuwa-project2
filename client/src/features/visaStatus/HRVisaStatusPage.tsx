import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { Segmented, message } from "antd";
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
  const inProgressQ = useQuery(VISA_EMPLOYEES, {
    variables: { search: search || undefined, inProgressOnly: true },
  });
  const allQ = useQuery(VISA_EMPLOYEES, {
    variables: { search: search || undefined, inProgressOnly: false },
  });
  const [reviewDoc, { loading: reviewing }] = useMutation(REVIEW_DOCUMENT);
  const [notify] = useMutation(SEND_NOTIFICATION);
  const [notifiedId, setNotifiedId] = useState<string | null>(null);

  const activeQ = tab === "inProgress" ? inProgressQ : allQ;
  const refetchAll = () =>
    Promise.all([inProgressQ.refetch(), allQ.refetch()]);

  const handleTabChange = (t: "inProgress" | "all") => {
    setTab(t);
    (t === "inProgress" ? inProgressQ : allQ).refetch();
  };

  const countLabel = (label: string, q: typeof inProgressQ) =>
    q.data ? `${label} (${q.data.visaEmployees.length})` : label;

  if (activeQ.error)
    return <p className="text-danger">Error: {activeQ.error.message}</p>;
  const rows = activeQ.data?.visaEmployees ?? [];

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
      if (res.data?.reviewDocument.success) await refetchAll();
      else message.error(res.data?.reviewDocument.message ?? "Review failed");
    };

  const handleNotify = async (userId: string) => {
    const res = await notify({ variables: { userId } });
    if (res.data?.sendNotification.success) setNotifiedId(userId);
    else message.error(res.data?.sendNotification.message ?? "Failed to send");
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h1>Visa Status Management</h1>
        <Segmented
          value={tab}
          className="[&_.ant-segmented-item]:font-semibold [&_.ant-segmented-item-selected]:text-primary!"
          onChange={(v) => handleTabChange(v as "inProgress" | "all")}
          options={[
            { label: countLabel("In Progress", inProgressQ), value: "inProgress" },
            { label: countLabel("All", allQ), value: "all" },
          ]}
        />
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
      {activeQ.loading && <p className="mt-4 text-gray-500">Loading…</p>}

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

      {!activeQ.loading && rows.length === 0 && (
        <p className="mt-8 text-center text-gray-400">
          {tab === "inProgress"
            ? "No employees with in-progress documents."
            : "No OPT employees found."}
        </p>
      )}
    </>
  );
}
