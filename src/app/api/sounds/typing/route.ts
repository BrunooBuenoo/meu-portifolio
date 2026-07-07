import { readdir } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

const SUPPORTED_AUDIO_EXTENSIONS = new Set([".mp3", ".wav", ".ogg", ".m4a"]);

export async function GET() {
  try {
    const soundsDir = path.join(process.cwd(), "public", "sounds");
    const entries = await readdir(soundsDir, { withFileTypes: true });

    const keySamples = entries
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .filter((fileName) => {
        const ext = path.extname(fileName).toLowerCase();
        if (!SUPPORTED_AUDIO_EXTENSIONS.has(ext)) return false;
        if (fileName.toLowerCase() === "space.mp3") return false;
        return true;
      })
      .sort((a, b) => a.localeCompare(b, "pt-BR"))
      .map((fileName) => `/sounds/${fileName}`);

    return NextResponse.json({ keySamples });
  } catch {
    return NextResponse.json({ keySamples: ["/sounds/type-1.mp3"] });
  }
}
