import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, isValidSessionToken } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!(await isValidSessionToken(token))) {
      return NextResponse.json({ error: "Your admin session has expired. Please sign in again." }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const folder = "uploads";

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only image and PDF files are supported." }, { status: 400 });
    }

    const extension = path.extname(file.name).toLowerCase().replace(/[^.a-z0-9]/g, "") || ".bin";
    const filename = `${randomUUID()}${extension}`;
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

    if (blobToken) {
      const blob = await put(`${folder}/${filename}`, file, {
        access: "public",
        addRandomSuffix: false,
        token: blobToken,
      });

      return NextResponse.json({ url: blob.url, filename });
    }

    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "File storage is not configured. Set BLOB_READ_WRITE_TOKEN in the deployment environment." },
        { status: 503 },
      );
    }

    const uploadDir = path.join(process.cwd(), "public", folder);
    await mkdir(uploadDir, { recursive: true });
    const bytes = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(uploadDir, filename), bytes);

    return NextResponse.json({
      url: `/${folder}/${filename}`,
      filename,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
