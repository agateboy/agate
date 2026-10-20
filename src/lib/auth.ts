const COOKIE_NAME = "admin_session";

function toHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("");
}

export async function createSessionToken() {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) return null;

  const encoder = new TextEncoder();
  const data = encoder.encode(secret);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return toHex(hashBuffer);
}

export async function isValidSessionToken(token: string | undefined) {
  if (!token) return false;
  const expectedToken = await createSessionToken();
  if (!expectedToken) return false;
  return token === expectedToken;
}

export { COOKIE_NAME };
