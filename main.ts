import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

// Copy entry.png from the repository into the grader's output directory.
// The grader sets MAKEFUN_OUTPUT_DIR; locally it defaults to ./out.
// The house reads the image from the output directory; nothing this program
// writes about the image counts toward the entry's score.
const srcUrl = new URL("./entry.png", import.meta.url);
const srcPath = srcUrl.pathname;

// Validate entry.png before copying: it must exist and start with the PNG
// signature bytes. A missing or non-PNG file fails loudly instead of being
// silently copied into the output directory.
let data: Buffer;
try {
  data = readFileSync(srcPath);
} catch {
  console.error("error: entry.png is missing from the repository");
  process.exit(1);
}
const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (data.length < 8 || !data.subarray(0, 8).equals(pngSignature)) {
  console.error("error: entry.png is not a valid PNG file");
  process.exit(1);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "out";
mkdirSync(outDir, { recursive: true });
copyFileSync(srcUrl, join(outDir, "entry.png"));
console.log(`copied entry.png (${data.length} bytes) to ${join(outDir, "entry.png")}`);
