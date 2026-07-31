import { useState, useEffect } from "react";
import { uploadFile, fetchFileAsBlobUrl } from "../../lib/uploadFile";

interface Props {
  documentId?: string;
  onChange: (documentId: string) => void;
}

export default function ProfilePictureField({ documentId, onChange }: Props) {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
    useEffect(() => {
    if (!documentId) {
        setImgUrl(null);
        return;
    }
    fetchFileAsBlobUrl(documentId, "preview")
        .then(setImgUrl)
        .catch((err) => {
        console.error("Failed to load profile picture:", err);
        setImgUrl(null);
        });
    }, [documentId]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const id = await uploadFile(file, "PROFILE_PICTURE");
    onChange(id);
  };

  return (
    <div className="mb-2 flex flex-col items-center gap-2">
      {imgUrl ? (
        <img src={imgUrl} alt="Profile" className="h-24 w-24 rounded-full object-cover" />
      ) : (
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 text-xs text-gray-400">
          photo
        </div>
      )}
      <label className="cursor-pointer text-sm font-medium text-primary">
        Upload
        <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
      </label>
    </div>
  );
}