// src/api.ts
const BASE_URL = "http://localhost:3000/api/v1";

export async function getRootFolders() {
  const res = await fetch(`${BASE_URL}/root`);
  return res.json();
}

export async function getSubfolders(id: number) {
  const res = await fetch(`${BASE_URL}/folders/${id}`);
  return res.json();
}

export async function getFiles(folderId: number) {
  const res = await fetch(`${BASE_URL}/files/folder/${folderId}`);
  return res.json();
}

export async function createFolder(name: string, parentId: number | null) {
  const res = await fetch(`${BASE_URL}/folders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, parentId }),
  });
  return res.json();
}

export async function createFile(name: string, type: string, folderId: number) {
  const res = await fetch(`${BASE_URL}/files`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, type, folderId }),
  });
  return res.json();
}

export async function deleteFile(id: number) {
  return fetch(`${BASE_URL}/files/${id}`, { method: "DELETE" });
}
export async function deleteFolder(id: number) {
  const res = await fetch(`${BASE_URL}/folders/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete folder");
  return res.json();
}
export async function uploadFile(folderId: number, file: File) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folderId", folderId.toString());

  const res = await fetch("http://localhost:3000/api/v1/files/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Failed to upload file");
  return res.json();
}

