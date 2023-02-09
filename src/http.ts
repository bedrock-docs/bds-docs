import { BDSVersions } from "./types.ts";

const BASE_URL = "https://raw.githubusercontent.com/Bedrock-OSS/BDS-Versions/main";

async function fetchJSON<T>(endpoint: string): Promise<T | undefined> {
  const res = await fetch(`${BASE_URL}/${endpoint}`);
  if (res.status !== 200) {
    return;
  }
  return await res.json();
}

export async function downloadFile(url: string, path: string) {
  const res = await fetch(url);
  if (res.status !== 200) {
    return;
  }

  const blob = await res.blob();
  const fs = await Deno.open(path, { write: true, create: true });
  await blob.stream().pipeTo(fs.writable);
}

export async function fetchBDSVersions() {
  return await fetchJSON<BDSVersions>("versions.json");
}

export async function fetchBDSDownloadURL(arch: string, version: string, preview: boolean) {
  const archDir = preview ? `${arch}_preview` : arch;
  const data = await fetchJSON<{ download_url: string }>(`${archDir}/${version}.json`);
  return data?.download_url;
}
