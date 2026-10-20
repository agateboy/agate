import { get } from "@vercel/blob";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type BlobRouteContext = {
  params: Promise<{ pathname: string[] }>;
};

export async function GET(_request: Request, { params }: BlobRouteContext) {
  try {
    const { pathname } = await params;
    const blobPath = pathname.join("/");

    if (!/^uploads\/[A-Za-z0-9-]+\.[A-Za-z0-9]+$/.test(blobPath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const token = process.env.BLOB_READ_WRITE_TOKEN;
    const storeId = process.env.BLOB_STORE_ID;
    const options = {
      access: "private",
      ...(token ? { token } : storeId ? { storeId } : {}),
    } as const;
    const result = await get(blobPath, options);

    if (!result || result.statusCode === 304) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    return new Response(result.stream, {
      headers: {
        "Content-Type": result.blob.contentType,
        "Content-Length": String(result.blob.size),
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
        "Content-Disposition": result.blob.contentDisposition,
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Blob read error:", error);
    return NextResponse.json({ error: "Unable to load file" }, { status: 500 });
  }
}