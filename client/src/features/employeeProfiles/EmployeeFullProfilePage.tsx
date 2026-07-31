import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import StatusBadge from "../../components/StatusBadge";
import { previewFile } from "../../utils/fileHelper";
import { EMPLOYEE_PROFILE } from "./graphql/employeeProfilesQueries";
import { Field, Section } from "../../components/FieldSection";
import { formatDate } from "../../utils/format";

function DocRow({ label, docId }: { label: string; docId: string | null }) {
  if (!docId) return null;
  return (
    <div className="col-span-full flex items-center justify-between rounded-lg border p-4">
      <p className="text-sm font-semibold">{label}</p>
      <button
        className="text-sm font-semibold text-primary"
        onClick={() => previewFile(`/api/files/${docId}`)}
      >
        Preview ↗
      </button>
    </div>
  );
}

export default function EmployeeFullProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const { data, loading, error } = useQuery(EMPLOYEE_PROFILE, {
    variables: { userId: userId! },
  });

  if (loading) return <p className="p-10 text-gray-500">Loading…</p>;
  if (error) return <p className="p-10 text-danger">Error: {error.message}</p>;
  const app = data?.employee;
  if (!app) return <p className="p-10 text-gray-500">Employee not found.</p>;

  return (
    <div className="min-h-screen bg-page px-8 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between">
          <div>
            <h1>
              {app.firstName} {app.middleName ?? ""} {app.lastName}
            </h1>
            <p className="text-gray-500">{app.onboardEmail}</p>
          </div>
          <StatusBadge status={app.status} />
        </div>

        <Section title="Personal">
          <Field label="First name" value={app.firstName} />
          <Field label="Last name" value={app.lastName} />
          <Field label="Preferred name" value={app.preferredName} />
          <Field label="Date of birth" value={formatDate(app.dob)} />
          <Field label="Gender" value={app.gender} />
          <Field label="SSN" value={app.ssn} />
          <Field
            label="Address"
            className="col-span-2"
            value={[
              app.address.apt,
              app.address.street,
              app.address.city,
              app.address.state,
              app.address.zip,
            ]
              .filter(Boolean)
              .join(", ")}
          />
        </Section>

        <Section title="Contact">
          <Field label="Cell phone" value={app.cellPhone} />
          <Field label="Work phone" value={app.workPhone} />
          <Field
            label="Email"
            value={app.onboardEmail}
            className="col-span-2"
          />
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
        </Section>

        <Section title="Reference & Emergency Contacts">
          <Field
            label="Reference"
            className="col-span-2"
            value={`${app.reference.firstName} ${app.reference.lastName} (${app.reference.relationship})`}
          />
          {app.emergencyContact.map((c, i) => (
            <Field
              key={i}
              label={`Emergency ${i + 1}`}
              className="col-span-2"
              value={`${c.firstName} ${c.lastName} (${c.relationship})${c.phone ? ` · ${c.phone}` : ""}`}
            />
          ))}
        </Section>

        <Section title="Documents">
          <DocRow label="Profile picture" docId={app.profilePicture} />
          <DocRow label="Driver's license" docId={app.driversLicense} />
          <DocRow label="Work authorization" docId={app.workAuthDoc} />
          {!app.profilePicture && !app.driversLicense && !app.workAuthDoc && (
            <p className="col-span-full text-sm text-gray-400">
              No documents uploaded.
            </p>
          )}
        </Section>
      </div>
    </div>
  );
}
