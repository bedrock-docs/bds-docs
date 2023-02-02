import { readJSON, writeJSON } from "./file.ts";
import { fetchBDSVersions } from "./http.ts";
import { generateDocumentation } from "./bds.ts";
import { BDSArchitecture } from "./types.ts";

async function main() {
  const bdsVersions = await fetchBDSVersions();
  if (!bdsVersions) {
    return;
  }

  if (Deno.build.os === "darwin") {
    return;
  }

  const versionsPath = "./versions.json";
  const versions = await readJSON<string[]>(versionsPath);

  const arch: BDSArchitecture = Deno.build.os;
  const bdsVersion = bdsVersions[arch];

  {
    const version = bdsVersion.stable;
    if (!versions.includes(version)) {
      console.log("Start generate stable", version, "docs.");
      await generateDocumentation(arch, version, false);
      versions.push(version);
    }
  }

  {
    const version = bdsVersion.preview;
    if (!versions.includes(version)) {
      console.log("Start generate preview", version, "docs.");
      await generateDocumentation(arch, version, true);
      versions.push(version);
    }
  }

  await writeJSON(versionsPath, versions);
}

if (import.meta.main) {
  await main();
}
