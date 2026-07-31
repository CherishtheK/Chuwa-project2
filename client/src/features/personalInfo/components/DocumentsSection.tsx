import { fetchFileAsBlobUrl } from "../../../lib/uploadFile";
import type { MyPersonalInfoData } from "../../../types/personalInfo";
import EditableSection from "../../../components/EditableSection";

interface Props {
  info: MyPersonalInfoData;
}

export default function DocumentsSection({ info }: Props) {
  const handlePreview = async (id: string) => {
    const url = await fetchFileAsBlobUrl(id, "preview");
    window.open(url, "_blank");
  };

  const handleDownload = async (id: string) => {
    const url = await fetchFileAsBlobUrl(id, "download");
    const a = document.createElement("a");
    a.href = url;
    a.download = "";
    a.click();
  };

  const docs = [
    { label: "Profile Picture", id: info.profilePicture },
    { label: "Driver's License", id: info.driversLicense },
    { label: "Work Authorization", id: info.workAuthDoc },
  ].filter((d) => d.id);

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6">
      <h2 className="mb-4 text-lg font-bold">Documents</h2>
      {docs.length === 0 ? (
        <p className="text-sm text-gray-500">No documents uploaded.</p>
      ) : (
        <div className="space-y-2">
          {docs.map((d) => (
            <div key={d.id} className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-2 text-sm">
              <span>{d.label}</span>
              <div className="flex gap-3">
                <button onClick={() => handlePreview(d.id!)} className="font-medium text-primary">Preview</button>
                <button onClick={() => handleDownload(d.id!)} className="font-medium text-primary">Download</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}