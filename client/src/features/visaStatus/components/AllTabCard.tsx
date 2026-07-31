import { previewFile, downloadFile } from "../../../utils/fileHelper";
import type { VisaEmployeeRow } from "../graphql/visaQueries";

export default function AllTabCard({ row }: { row: VisaEmployeeRow }) {
  const approvedDocs = row.documents.filter((d) => d.status === "APPROVED");

  return (
    <div className="mt-5 rounded-xl bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-bold">{row.fullName}</p>
          <p className="text-sm text-gray-500">
            F1 (OPT) · {row.visaStartDate?.slice(0, 10)} –{" "}
            {row.visaEndDate?.slice(0, 10)} ·{" "}
            <span
              className={
                row.daysRemaining !== null && row.daysRemaining < 90
                  ? "text-danger"
                  : "text-success"
              }
            >
              {row.daysRemaining ?? "—"} days remaining
            </span>
          </p>
        </div>
        <p className="text-sm text-gray-500">
          Next step:{" "}
          <span className="font-semibold text-primary">{row.nextStep}</span>
        </p>
      </div>

      <div className="mt-4 divide-y">
        {approvedDocs.map((d) => (
          <div key={d.id} className="flex items-center justify-between py-2.5">
            <div>
              <p className="text-sm font-semibold">
                {d.type.replace(/_/g, " ")}
              </p>
              <p className="text-xs text-gray-500">{d.filename}</p>
            </div>
            <div className="flex gap-3 text-sm font-semibold text-primary">
              <button onClick={() => previewFile(d.url)}>Preview</button>
              <button onClick={() => downloadFile(d.url, d.filename)}>
                Download
              </button>
            </div>
          </div>
        ))}
        {approvedDocs.length === 0 && (
          <p className="py-3 text-sm text-gray-400">
            No approved documents yet.
          </p>
        )}
      </div>
    </div>
  );
}
