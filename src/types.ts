export interface Versions {
  stable: string[];
  preview: string[];
}

export interface BDSVersion {
  stable: string;
  preview: string;
  versions: string[];
  preview_versions: string[];
}

export type ReleaseType = "stable" | "preview";
export type BDSArchitecture = "windows" | "linux";
export type BDSVersions = Record<BDSArchitecture, BDSVersion>;
