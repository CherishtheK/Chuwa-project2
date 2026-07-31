import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { EMPLOYEES } from "./graphql/employeeProfilesQueries";
import SearchInput from "../../components/SearchInput";
import { recordsFoundLabel } from "../../utils/format";

const AUTH_LABELS: Record<string, string> = {
  GREEN_CARD: "Green Card",
  CITIZEN: "Citizen",
  H1B: "H1-B",
  L2: "L2",
  F1_CPT_OPT: "F1 (OPT)",
  H4: "H4",
};

const maskSsn = (ssn: string) => `•••-••-${ssn.replace(/\D/g, "").slice(-4)}`;
const formatPhone = (p: string) => {
  const d = p.replace(/\D/g, "");
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
};

export default function EmployeeProfilesPage() {
  const [search, setSearch] = useState("");
  const { data, loading, error } = useQuery(EMPLOYEES, {
    variables: { search: search || undefined },
  });

  if (error) return <p className="text-danger">Error: {error.message}</p>;
  const rows = data?.employees ?? [];

  const label = !search
    ? `${rows.length} employees · ordered by last name`
    : recordsFoundLabel(rows.length);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1>Employee Profiles</h1>
          <p className="mt-1 text-sm text-gray-500">{label}</p>
        </div>
        <SearchInput onSearch={setSearch} />
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl bg-white shadow-sm">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b text-left text-xs uppercase tracking-wide text-gray-400">
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">SSN</th>
              <th className="px-5 py-3">Work Authorization</th>
              <th className="px-5 py-3">Phone</th>
              <th className="px-5 py-3">Email</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="px-5 py-6 text-center text-gray-400">
                  Loading…
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <tr
                key={r.userId}
                className="border-b last:border-0 hover:bg-gray-50"
              >
                <td className="px-5 py-3">
                  <a
                    href={`/hr/employees/${r.userId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-primary hover:underline"
                  >
                    {r.fullName}
                  </a>
                </td>
                <td className="px-5 py-3">{maskSsn(r.ssn)}</td>
                <td className="px-5 py-3">
                  {r.workAuth ? (AUTH_LABELS[r.workAuth] ?? r.workAuth) : "—"}
                </td>
                <td className="px-5 py-3">{formatPhone(r.phone)}</td>
                <td className="px-5 py-3">{r.email}</td>
              </tr>
            ))}
            {!loading && rows.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-10 text-center text-gray-400"
                >
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
