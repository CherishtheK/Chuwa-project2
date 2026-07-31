import { previewFile, downloadFile } from "../../utils/fileHelper";
import type { OnboardingApplicationData } from "../../types/onboarding";

interface Props {
  application: OnboardingApplicationData;
}

const DOC_FIELDS: { key: keyof OnboardingApplicationData; label: string }[] = [
  { key: "profilePicture", label: "Profile Picture" },
  { key: "driversLicense", label: "Driver's License" },
  { key: "workAuthDoc", label: "Work Authorization Document" },
];

export default function PendingView({ application }: Props) {
  const handlePreview = async (documentId: string) => {
    await previewFile(`/api/files/${documentId}`);
  };

  const handleDownload = async (documentId: string) => {
    await downloadFile(`/api/files/${documentId}`, "");
  };

  return (
    <div>
      <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
        Please wait for HR to review your application.
      </div>

      <section className="mb-6 rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-bold">Submitted Information</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Name</p>
            <p className="font-medium">
              {application.firstName} {application.middleName} {application.lastName}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Preferred name</p>
            <p className="font-medium">{application.preferredName || "—"}</p>
          </div>
          <div>
            <p className="text-gray-500">Email</p>
            <p className="font-medium">{application.onboardEmail}</p>
          </div>
          <div>
            <p className="text-gray-500">Cell phone</p>
            <p className="font-medium">{application.cellPhone}</p>
          </div>
          <div>
            <p className="text-gray-500">Address</p>
            <p className="font-medium">
              {application.address.street}, {application.address.city}, {application.address.state} {application.address.zip}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Work authorization</p>
            <p className="font-medium">
              {application.isPermanent ? application.citizenshipType : application.workAuth}
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-bold">Uploaded Documents</h2>
        <div className="space-y-3">
          {DOC_FIELDS.map(({ key, label }) => {
            const documentId = application[key] as string | null;
            if (!documentId) return null;
            return (
              <div key={key} className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3">
                <span className="text-sm font-medium">{label}</span>
                <div className="flex gap-3 text-sm">
                  <button type="button" onClick={() => handlePreview(documentId)} className="font-medium text-primary">
                    Preview
                  </button>
                  <button type="button" onClick={() => handleDownload(documentId)} className="font-medium text-primary">
                    Download
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}