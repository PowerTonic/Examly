// Turns a picked image File into a compact data URL we can store on a question
// or answer option. Large photos are downscaled and re-encoded so the base64
// payload stays small enough to live happily inside JSON + SQLite.

const MAX_DIMENSION = 1280; // longest edge, in px
const JPEG_QUALITY = 0.85;
export const MAX_FILE_BYTES = 8 * 1024 * 1024; // reject anything wildly large up front

export async function fileToDataUrl(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("That file isn't an image.");
  }
  if (file.size > MAX_FILE_BYTES) {
    throw new Error("Image is too large (max 8 MB).");
  }

  const rawDataUrl = await readAsDataUrl(file);

  // SVGs and tiny images don't benefit from canvas re-encoding — keep as-is.
  if (file.type === "image/svg+xml") return rawDataUrl;

  const img = await loadImage(rawDataUrl);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
  if (scale === 1 && file.size < 400 * 1024) {
    return rawDataUrl; // already small enough; avoid needless quality loss
  }

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) return rawDataUrl;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  // Preserve transparency for PNGs, otherwise compress to JPEG.
  const keepPng = file.type === "image/png";
  return canvas.toDataURL(
    keepPng ? "image/png" : "image/jpeg",
    keepPng ? undefined : JPEG_QUALITY
  );
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Couldn't read that file."));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Couldn't load that image."));
    img.src = src;
  });
}
