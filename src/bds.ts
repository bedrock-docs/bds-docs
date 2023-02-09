import { resetDir, writeJSON } from "./file.ts";
import { downloadFile, fetchBDSDownloadURL } from "./http.ts";
import { BDSArchitecture } from "./types.ts";

import { decompress } from "zip";
import { move } from "fs";

const BDS_DIR_PATH = "bds";

export async function setupBDS(dir: string) {
  await writeJSON(`${dir}/test_config.json`, { generate_documentation: true }, 0);
}

export function getDocsDir(version: string, preview: boolean) {
  return `docs/${preview ? "preview" : "stable"}/${version}`;
}

export async function launchBDS(arch: BDSArchitecture, dir: string) {
  const cmd = arch === "linux" ? "./bedrock_server" : `${dir}/bedrock_server.exe`;
  const p = Deno.run({ cmd: [cmd], cwd: dir, stdout: "null" });
  await p.status();
  p.close();
}

export async function generateDocumentation(
  arch: BDSArchitecture,
  version: string,
  preview: boolean,
) {
  const url = await fetchBDSDownloadURL(arch, version, preview);
  if (!url) {
    return false;
  }

  await resetDir(BDS_DIR_PATH);

  const filePath = `${BDS_DIR_PATH}/${version}.zip`;
  await downloadFile(url, filePath);
  await decompress(filePath, BDS_DIR_PATH);
  await setupBDS(BDS_DIR_PATH);
  await launchBDS(arch, BDS_DIR_PATH);
  await move(`${BDS_DIR_PATH}/docs`, getDocsDir(version, preview), { overwrite: true });
  return true;
}
