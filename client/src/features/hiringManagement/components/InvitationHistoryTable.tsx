import { useState } from "react";
import StatusBadge from "../../../components/StatusBadge";
import type { TokenRow } from "../graphql/hiringManagementQueries";

function tokenStatus(t: TokenRow): string {
  if (t.applicationSubmitted) return "SUBMITTED";
  if (t.used) return "PENDING";
  if (new Date(t.expireAt) < new Date()) return "NOT_STARTED";
  return "PENDING";
}

export default function InvitationHistoryTable({
  tokens,
}: {
  tokens: TokenRow[];
}) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (t: TokenRow) => {
    await navigator.clipboard.writeText(t.link);
    setCopiedId(t.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
      <h2>Invitation history</h2>
      <table className="mt-4 w-full text-sm">
        <thead>
          <tr className="border-b text-left text-xs uppercase text-gray-400">
            <th className="py-2">Name</th>
            <th>Email</th>
            <th>Link</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((t) => (
            <tr key={t.id} className="border-b last:border-0">
              <td className="py-3 font-semibold">{t.invitedName}</td>
              <td>{t.invitedEmail}</td>
              <td>
                {!t.used && new Date(t.expireAt) < new Date() ? (
                  <span className="text-gray-400">expired</span>
                ) : (
                  <button
                    onClick={() => handleCopy(t)}
                    className="font-semibold text-primary"
                  >
                    {copiedId === t.id ? "Copied!" : "Copy link"}
                  </button>
                )}
              </td>
              <td>
                <StatusBadge status={tokenStatus(t)} />
              </td>
            </tr>
          ))}
          {tokens.length === 0 && (
            <tr>
              <td colSpan={4} className="py-6 text-center text-gray-400">
                No invitations yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
