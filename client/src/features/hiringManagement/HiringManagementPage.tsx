import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { message } from "antd";
import {
  REGISTRATION_TOKENS,
  APPLICATIONS_BY_STATUS,
  GENERATE_TOKEN,
} from "./graphql/hiringManagementQueries";
import TokenGenerator from "./components/TokenGenerator";
import InvitationHistoryTable from "./components/InvitationHistoryTable";
import ApplicationReviewTabs, {
  type Tab,
} from "./components/ApplicationReviewTabs";

export default function HiringManagementPage() {
  const [tab, setTab] = useState<Tab>("PENDING");

  const tokensQ = useQuery(REGISTRATION_TOKENS);
  const pendingQ = useQuery(APPLICATIONS_BY_STATUS, {
    variables: { status: "PENDING" },
  });
  const approvedQ = useQuery(APPLICATIONS_BY_STATUS, {
    variables: { status: "APPROVED" },
  });
  const rejectedQ = useQuery(APPLICATIONS_BY_STATUS, {
    variables: { status: "REJECTED" },
  });
  const [generateToken, { loading: inviting }] = useMutation(GENERATE_TOKEN);

  const byTab = {
    PENDING: pendingQ,
    APPROVED: approvedQ,
    REJECTED: rejectedQ,
  };
  const activeQ = byTab[tab];

  const counts = {
    PENDING: pendingQ.data?.applicationsByStatus.length,
    APPROVED: approvedQ.data?.applicationsByStatus.length,
    REJECTED: rejectedQ.data?.applicationsByStatus.length,
  };

  const handleTabChange = (t: Tab) => {
    setTab(t);
    byTab[t].refetch();
  };

  const handleInvite = async (name: string, email: string) => {
    const res = await generateToken({
      variables: { input: { invitedName: name, invitedEmail: email } },
    });
    const result = res.data?.generateRegistrationToken;
    if (result?.success) {
      message.success("Invitation sent");
      await tokensQ.refetch();
      return true;
    }
    message.error(result?.message ?? "Failed to send invitation");
    return false;
  };

  return (
    <>
      <h1>Hiring Management</h1>
      <TokenGenerator inviting={inviting} onInvite={handleInvite} />
      <InvitationHistoryTable
        tokens={tokensQ.data?.registrationTokens ?? []}
      />
      <ApplicationReviewTabs
        tab={tab}
        onTabChange={handleTabChange}
        counts={counts}
        apps={activeQ.data?.applicationsByStatus ?? []}
        loading={activeQ.loading}
      />
    </>
  );
}
