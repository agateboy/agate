import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

export async function storeUpload(file: File | null, folder = "uploads") {
  if (!file || file.size === 0) {
    return null;
  }

  const uploadDir = path.join(process.cwd(), "public", folder);
  await mkdir(uploadDir, { recursive: true });

  const extension = path.extname(file.name) || ".bin";
  const filename = `${randomUUID()}${extension}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadDir, filename), bytes);

  return `/${folder}/${filename}`;
}
