import axios from "axios";


export async function getFileBlobUrl(url: string): Promise<string> {
  const token = localStorage.getItem("token");
  const res = await axios.get(url, {
    responseType: "blob",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return URL.createObjectURL(res.data);
}

export async function previewFile(url: string) {
  const blobUrl = await getFileBlobUrl(url);
  window.open(blobUrl, "_blank");

  setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
}

export async function downloadFile(url: string, filename: string) {
  const blobUrl = await getFileBlobUrl(url);
  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
}


export async function uploadFile(file: File, type: string): Promise<string> {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", type);

  const res = await axios.post("/api/upload", formData, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  return res.data.id as string;
}
