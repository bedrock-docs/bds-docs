import { readJSON, writeJSON } from "./file.ts";
import { fetchBDSVersions } from "./http.ts";
import { generateDocumentation } from "./bds.ts";
import { BDSArchitecture, ReleaseType, Versions } from "./types.ts";

async function main() {
  const bdsVersions = await fetchBDSVersions();
  if (!bdsVersions) {
    return;
  }

  if (Deno.build.os === "darwin") {
    return;
  }

  const versionsPath = "./versions.json";
  const versionsMap = await readJSON<Versions>(versionsPath);

  const arch: BDSArchitecture = Deno.build.os;
  const bdsVersion = bdsVersions[arch];

  const types: ReleaseType[] = ["stable", "preview"];
  for (const type of types) {
    const version = bdsVersion[type];
    const versions = versionsMap[type];
    if (versions.includes(version)) {
      continue;
    }

    console.log("Start generate", type, version, "docs.");
    await generateDocumentation(arch, version, false);
    versions.push(version);
  }

  await writeJSON(versionsPath, versionsMap);
}

if (import.meta.main) {
  await main();
}
