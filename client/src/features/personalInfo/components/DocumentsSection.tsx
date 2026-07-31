import { previewFile, downloadFile } from "../../../utils/fileHelper";
import type { MyPersonalInfoData } from "../../../types/personalInfo";

interface Props {
  info: MyPersonalInfoData;
}

export default function DocumentsSection({ info }: Props) {
  const handlePreview = async (id: string) => {
    await previewFile(`/api/files/${id}`);
  };

  const handleDownload = async (id: string, label: string) => {
    await downloadFile(`/api/files/${id}`, label);
  };

  const docs = [
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
                <button onClick={() => handleDownload(d.id!, d.label)} className="font-medium text-primary">Download</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}