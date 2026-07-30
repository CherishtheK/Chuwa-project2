import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import StatusBadge from "../../components/StatusBadge";
import {
  REGISTRATION_TOKENS,
  APPLICATIONS_BY_STATUS,
  GENERATE_TOKEN,
  type TokenRow,
} from "./graphql/hiringManagementQueries";

const TABS = ["PENDING", "APPROVED", "REJECTED"] as const;
type Tab = (typeof TABS)[number];

function tokenStatus(t: TokenRow): string {
  if (t.applicationSubmitted) return "SUBMITTED";
  if (t.used) return "PENDING";
  if (new Date(t.expireAt) < new Date()) return "NOT_STARTED";
  return "PENDING";
}

export default function HiringManagementPage() {
  const [tab, setTab] = useState<Tab>("PENDING");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [inviteMsg, setInviteMsg] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const tokensQ = useQuery(REGISTRATION_TOKENS);
  const appsQ = useQuery(APPLICATIONS_BY_STATUS, {
    variables: { status: tab },
  });
  const [generateToken, { loading: inviting }] = useMutation(GENERATE_TOKEN);

  const handleInvite = async () => {
    if (!name.trim() || !email.trim()) {
      setInviteMsg("Name and email are required");
      return;
    }
    setInviteMsg(null);
    const res = await generateToken({
      variables: {
        input: { invitedName: name.trim(), invitedEmail: email.trim() },
      },
    });
    const result = res.data?.generateRegistrationToken;
    if (result?.success) {
      setName("");
      setEmail("");
      setInviteMsg("Invitation sent ✓");
      setTimeout(() => setInviteMsg(null), 3000);
      await tokensQ.refetch();
    } else {
      setInviteMsg(result?.message ?? "Failed to send invitation");
    }
  };

  const handleCopy = async (t: TokenRow) => {
    await navigator.clipboard.writeText(t.link);
    setCopiedId(t.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const tokens = tokensQ.data?.registrationTokens ?? [];
  const apps = appsQ.data?.applicationsByStatus ?? [];

  return (
    <>
      <h1>Hiring Management</h1>

      {/* generate tokena and send email */}
      <div className="mt-6 rounded-xl bg-primary p-6 text-white">
        <p className="font-bold">Invite a new employee</p>
        <p className="text-sm text-white/80">
          Generate a registration token and email the signup link. Tokens expire
          after 3 hours.
        </p>
        <div className="mt-4 flex gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="rounded-lg px-3 py-2 text-sm text-gray-900 bg-white"
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
            className="w-64 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white"
          />
          <button
            onClick={handleInvite}
            disabled={inviting}
            className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-primary disabled:opacity-50"
          >
            {inviting ? "Sending…" : "+ Generate token & send email"}
          </button>
        </div>
        {inviteMsg && <p className="mt-2 text-sm text-white/90">{inviteMsg}</p>}
      </div>

      {/* invitated history table */}
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

      {/* onboarding application review with 3 tabs */}
      <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2>Onboarding application review</h2>
          <div className="flex rounded-lg bg-gray-100 p-1 text-sm">
            {TABS.map((s) => (
              <button
                key={s}
                onClick={() => setTab(s)}
                className={`rounded-md px-4 py-1.5 font-semibold ${tab === s ? "bg-white text-primary shadow-sm" : "text-gray-500"}`}
              >
                {s[0] + s.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>
        {apps.map((a) => (
          <div
            key={a.owner}
            className="mt-4 flex items-center justify-between rounded-lg border p-4"
          >
            <div>
              <p className="font-semibold">
                {a.firstName} {a.lastName}
              </p>
              <p className="text-sm text-gray-500">{a.onboardEmail}</p>
            </div>
            <a
              href={`/hr/applications/${a.owner}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border px-4 py-2 text-sm font-semibold text-primary"
            >
              View application ↗
            </a>
          </div>
        ))}
        {apps.length === 0 && !appsQ.loading && (
          <p className="mt-6 text-center text-sm text-gray-400">
            No {tab.toLowerCase()} applications.
          </p>
        )}
      </div>
    </>
  );
}
