async function exists(path: string) {
  try {
    await Deno.stat(path);
    return true;
  } catch {
    return false;
  }
}

export async function readJSON<T>(path: string): Promise<T> {
  const text = await Deno.readTextFile(path);
  return JSON.parse(text);
}

export async function writeJSON<T>(path: string, json: T, indent = 2) {
  const text = JSON.stringify(json, null, indent);
  await Deno.writeTextFile(path, text);
}

export async function resetDir(path: string) {
  if (await exists(path)) {
    await Deno.remove(path, { recursive: true });
  }
  await Deno.mkdir(path);
}
