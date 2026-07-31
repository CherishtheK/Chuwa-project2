import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client/react";
import { Alert, message } from "antd";
import StatusBadge from "../../components/StatusBadge";
import ApprovalActionBar from "../../components/ApprovalActionBar";
import {
  EMPLOYEE_APPLICATION,
  REVIEW_APPLICATION,
} from "./graphql/applicationReviewQueries";
import { previewFile } from "../../utils/fileHelper";
import { Field, Section } from "../../components/FieldSection";
import { formatDate } from "../../utils/format";

export default function ApplicationReviewPage() {
  const { userId } = useParams<{ userId: string }>();
  const { data, loading, error, refetch } = useQuery(EMPLOYEE_APPLICATION, {
    variables: { userId: userId! },
  });
  const [review, { loading: reviewing }] = useMutation(REVIEW_APPLICATION);

  if (loading) return <p className="p-10 text-gray-500">Loading…</p>;
  if (error) return <p className="p-10 text-danger">Error: {error.message}</p>;
  const app = data?.employee;
  if (!app) return <p className="p-10 text-gray-500">Application not found.</p>;

  const handleReview = async (
    decision: "APPROVE" | "REJECT",
    feedback: string,
  ) => {
    const res = await review({
      variables: {
        userId: userId!,
        decision,
        ...(decision === "REJECT" ? { feedback } : {}),
      },
    });
    if (res.data?.reviewApplication.success) await refetch();
    else message.error(res.data?.reviewApplication.message ?? "Review failed");
  };

  return (
    <div className="min-h-screen bg-page px-8 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between">
          <div>
            <h1>Onboarding Application</h1>
            <p className="text-gray-500">
              {app.firstName} {app.lastName} · {app.onboardEmail}
            </p>
          </div>
          <StatusBadge status={app.status} />
        </div>

        {app.status === "REJECTED" && app.feedback && (
          <Alert
            type="error"
            showIcon
            message="HR feedback"
            description={app.feedback}
            className="mt-4"
          />
        )}

        <Section title="Name & Identity">
          <Field label="First name" value={app.firstName} />
          <Field label="Last name" value={app.lastName} />
          <Field label="Preferred name" value={app.preferredName} />
          <Field label="Date of birth" value={formatDate(app.dob)} />
        </Section>

        <Section title="Address & Contact">
          <Field
            label="Address"
            value={[
              app.address.apt,
              app.address.street,
              app.address.city,
              app.address.state,
              app.address.zip,
            ]
              .filter(Boolean)
              .join(", ")}
            className="col-span-2 "
          />
          <Field label="Cell phone" value={app.cellPhone} />
          <Field label="Email" value={app.onboardEmail} />
        </Section>

        <Section title="Reference & Emergency Contacts">
          <Field label="SSN" value={app.ssn} />
          <Field label="Gender" value={app.gender} />
          <Field
            label="Reference"
            value={`${app.reference.firstName} ${app.reference.lastName} (${app.reference.relationship})`}
            className="col-span-2"
          />
          {app.emergencyContact.map((c, i) => (
            <Field
              key={i}
              label={`Emergency ${i + 1}`}
              value={`${c.firstName} ${c.lastName} (${c.relationship})`}
              className="col-span-2"
            />
          ))}
        </Section>

        <Section title="Work Authorization">
          <Field label="Citizen / PR?" value={app.isPermanent ? "Yes" : "No"} />
          <Field
            label="Type"
            value={
              app.isPermanent
                ? app.citizenshipType
                : app.workAuth === "OTHER"
                  ? app.otherVisaTitle
                  : app.workAuth
            }
          />
          <Field label="Start date" value={formatDate(app.visaStartDate)} />
          <Field label="End date" value={formatDate(app.visaEndDate)} />
          {app.workAuthDoc && (
            <div className="col-span-full mt-2 flex items-center justify-between rounded-lg border p-4">
              <p className="text-sm font-semibold">
                Work authorization document
              </p>
              <button
                className="text-sm font-semibold text-primary"
                onClick={() => previewFile(`/api/files/${app.workAuthDoc}`)}
              >
                Preview ↗
              </button>
            </div>
          )}
        </Section>

        {app.status === "PENDING" && (
          <ApprovalActionBar onSubmit={handleReview} loading={reviewing} />
        )}
      </div>
    </div>
  );
}
