import { useState } from "react";

interface Props {
  onSubmit: (decision: "APPROVE" | "REJECT", feedback: string) => Promise<void>;
  loading?: boolean;
}

export default function ApprovalActionBar({ onSubmit, loading }: Props) {
  const [feedback, setFeedback] = useState("");
  const [warn, setWarn] = useState(false);

  const decide = (decision: "APPROVE" | "REJECT") => {
    if (decision === "REJECT" && !feedback.trim()) {
      setWarn(true);
      return;
    }
    onSubmit(decision, feedback.trim());
  };

  return (
    <div className="mt-5 rounded-xl bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold">
        Feedback{" "}
        <span className="font-normal text-gray-500">
          (required if rejecting)
        </span>
      </p>
      <textarea
        value={feedback}
        onChange={(e) => {
          setFeedback(e.target.value);
          setWarn(false);
        }}
        placeholder="Add a note for the applicant…"
        className="mt-2 w-full rounded-lg border p-3 text-sm"
      />
      {warn && (
        <p className="mt-1 text-sm text-danger">
          Feedback is required to reject.
        </p>
      )}
      <div className="mt-3 flex justify-end gap-2">
        <button
          onClick={() => decide("REJECT")}
          disabled={loading}
          className="rounded-lg border border-danger px-4 py-2 text-sm font-semibold text-danger disabled:opacity-50"
        >
          Reject
        </button>
        <button
          onClick={() => decide("APPROVE")}
          disabled={loading}
          className="rounded-lg bg-success px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          Approve
        </button>
      </div>
    </div>
  );
}
