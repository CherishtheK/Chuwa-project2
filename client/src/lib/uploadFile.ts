const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export async function uploadFile(file: File, type: string): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", type);

  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}/api/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error ?? "Upload failed");
  }

  const data = await res.json();
  return data.id as string;
}

export function getFileUrl(documentId: string, mode: "preview" | "download" = "preview") {
  const query = mode === "download" ? "?download=1" : "";
  return `${API_BASE}/api/files/${documentId}${query}`;
}

export async function fetchFileAsBlobUrl(
  documentId: string,
  mode: "preview" | "download" = "preview",
): Promise<string> {
  const token = localStorage.getItem("token");
  const query = mode === "download" ? "?download=1" : "";

  const res = await fetch(`${API_BASE}/api/files/${documentId}${query}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to load file");
  }

  const blob = await res.blob();
  return URL.createObjectURL(blob);
}