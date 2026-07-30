import axios from "axios";

async function fetchFileBlobUrl(url: string): Promise<string> {
  const token = localStorage.getItem("token");
  const res = await axios.get(url, {
    responseType: "blob",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return URL.createObjectURL(res.data);
}

export async function previewFile(url: string) {
  const blobUrl = await fetchFileBlobUrl(url);
  window.open(blobUrl, "_blank");
  //打开url后释放内存
  setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
}

export async function downloadFile(url: string, filename: string) {
  const blobUrl = await fetchFileBlobUrl(url);
  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
}
