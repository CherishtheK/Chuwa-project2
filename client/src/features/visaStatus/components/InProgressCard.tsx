import ApprovalActionBar from "../../../components/ApprovalActionBar";
import StatusBadge from "../../../components/StatusBadge";
import { previewFile } from "../../../utils/fileHelper";
import type { VisaEmployeeRow } from "../graphql/visaQueries";
import EmployeeSummary from "./EmployeeSummary";
import { MailOutlined, CheckOutlined } from "@ant-design/icons";

interface Props {
  row: VisaEmployeeRow;
  reviewing: boolean;
  onReview: (
    documentId: string,
  ) => (decision: "APPROVE" | "REJECT", feedback: string) => Promise<void>;
  notified: boolean;
  onNotify: (userId: string) => void;
}

export default function InProgressCard({
  row,
  reviewing,
  onReview,
  notified,
  onNotify,
}: Props) {
  const doc = row.pendingDocument;

  return (
    <div className="mt-5 rounded-xl bg-white p-6 shadow-sm">
      <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        <EmployeeSummary row={row} />

        {doc ? (
          <div className="min-w-0">
            <div className="flex items-center justify-between">
              <p className="font-bold">
                Document awaiting review · {doc.type.replace(/_/g, " ")}
              </p>
              <StatusBadge status="NEEDS_ACTION" />
            </div>
            <div className="mt-3 flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="text-sm font-semibold">{doc.filename}</p>
                <p className="text-xs text-gray-500">
                  Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                </p>
              </div>
              <button
                className="text-sm font-semibold text-primary"
                onClick={() => previewFile(doc.url)}
              >
                Preview
              </button>
            </div>
            <ApprovalActionBar
              onSubmit={onReview(doc.id)}
              loading={reviewing}
            />
          </div>
        ) : (
          <div className="flex items-center justify-end">
            <button
              onClick={() => onNotify(row.userId)}
              disabled={notified}
              className="rounded-lg border px-4 py-2 text-sm font-semibold text-primary disabled:opacity-50"
            >
              {notified ? (
                <>
                  <CheckOutlined /> Notification sent
                </>
              ) : (
                <>
                  <MailOutlined /> Send notification
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
