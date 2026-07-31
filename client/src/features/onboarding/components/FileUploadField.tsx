import { useState } from "react";
import axios from "axios";
import { uploadFile, previewFile, downloadFile } from "../../../utils/fileHelper";

interface Props {
  label: string;
  docType: string;
  value?: string;
  onChange: (documentId: string) => void;
  error?: string;
}

export default function FileUploadField({ label, docType, value, onChange, error }: Props) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    try {
      const documentId = await uploadFile(file, docType);
      onChange(documentId);
    } catch (err) {
      const serverMessage = axios.isAxiosError(err)
        ? (err.response?.data as { error?: string } | undefined)?.error
        : null;
      setUploadError(serverMessage ?? "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handlePreview = async () => {
    if (!value) return;
    await previewFile(`/api/files/${value}`);
  };

  const handleDownload = async () => {
    if (!value) return;
    await downloadFile(`/api/files/${value}`, label);
  };

  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>

      {value ? (
        <div className="flex items-center justify-between rounded-lg border border-dashed border-gray-200 px-4 py-3">
          <span className="text-sm">Uploaded</span>
          <div className="flex gap-3 text-sm">
            <button type="button" onClick={handlePreview} className="font-medium text-primary">
              Preview
            </button>
            <button type="button" onClick={handleDownload} className="font-medium text-primary">
              Download
            </button>
            <label className="cursor-pointer font-medium text-primary">
              Replace
              <input type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
            </label>
          </div>
        </div>
      ) : (
        <label className="flex cursor-pointer items-center justify-center rounded-lg border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-500 hover:border-primary hover:text-primary">
          {uploading ? "Uploading..." : "Click to upload"}
          <input type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
        </label>
      )}

      {uploadError && <p className="mt-1 text-xs text-danger">{uploadError}</p>}
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}