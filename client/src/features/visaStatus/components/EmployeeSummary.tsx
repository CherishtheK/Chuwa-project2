import type { VisaEmployeeRow } from "../graphql/visaQueries";

export default function EmployeeSummary({ row }: { row: VisaEmployeeRow }) {
  return (
    <div className="min-w-0 lg:border-r lg:pr-6">
      <p className="font-bold">{row.fullName}</p>
      <p className="text-sm text-gray-500">{row.email}</p>
      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-gray-500">Work auth.</dt>
          <dd className="font-semibold">F1 (OPT)</dd>
        </div>
        <div className="flex flex-wrap justify-between gap-x-4">
          <dt className="text-gray-500">Start – End</dt>
          <dd className="text-right font-semibold">
            {row.visaStartDate?.slice(0, 10)} – {row.visaEndDate?.slice(0, 10)}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-gray-500">Days remaining</dt>
          <dd
            className={`font-semibold ${row.daysRemaining !== null && row.daysRemaining < 90 ? "text-danger" : "text-success"}`}
          >
            {row.daysRemaining ?? "—"}
          </dd>
        </div>
      </dl>
      <div className="mt-4 rounded-lg bg-gray-50 p-3">
        <p className="text-xs text-gray-500">Next step</p>
        <p className="mt-0.5 text-sm font-semibold text-primary">
          {row.nextStep}
        </p>
      </div>
    </div>
  );
}
