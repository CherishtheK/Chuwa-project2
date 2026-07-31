import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client/react";
import StatusBadge from "../../components/StatusBadge";
import ApprovalActionBar from "../../components/ApprovalActionBar";
import {
  EMPLOYEE_APPLICATION,
  REVIEW_APPLICATION,
} from "./graphql/applicationReviewQueries";
import { previewFile } from "../../utils/fileHelper";

function Field({
  label,
  value,
  className,
}: {
  label: string;
  value?: string | null;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1">{value || "—"}</p>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-5 rounded-xl bg-white p-6 shadow-sm">
      <h2 className="pb-4">{title}</h2>
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">{children}</div>
    </div>
  );
}

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
    else alert(res.data?.reviewApplication.message ?? "Review failed");
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
          <div className="mt-4 rounded-lg bg-red-50 p-4 text-sm">
            <p className="font-semibold text-danger">HR feedback</p>
            <p className="mt-1">{app.feedback}</p>
          </div>
        )}

        <Section title="Name & Identity">
          <Field label="First name" value={app.firstName} />
          <Field label="Last name" value={app.lastName} />
          <Field label="Preferred name" value={app.preferredName} />
          <Field label="Date of birth" value={app.dob?.slice(0, 10)} />
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
          <Field label="Start date" value={app.visaStartDate?.slice(0, 10)} />
          <Field label="End date" value={app.visaEndDate?.slice(0, 10)} />
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
