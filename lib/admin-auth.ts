import type { NextRequest } from "next/server";

export interface AdminUser {
  username: string;
  displayName: string;
  role: string;
  avatarLetter: string;
}

export const ADMIN_USERS: Record<string, { password: string; user: AdminUser }> = {
  tamersobhy123: {
    password: "tamer@sobhy@123",
    user: {
      username: "tamersobhy123",
      displayName: "أ/ تامر صبحي عبدالله",
      role: "مدير النظام ورئيس مجلس الإدارة",
      avatarLetter: "ت",
    },
  },
  davidelks: {
    password: "mmmmllll@1D",
    user: {
      username: "davidelks",
      displayName: "ديفيد جرجس (David E.)",
      role: "المطور والمسؤول التقني",
      avatarLetter: "D",
    },
  },
};

const SESSION_COOKIE_NAME = "med_admin_session";
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || "med-aggregator-secret-token-auth-2026-secure-key";

/**
 * Creates a signed token for an admin session
 */
export async function createSessionToken(username: string): Promise<string> {
  const payload = {
    username,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    iat: Date.now(),
  };

  const payloadStr = JSON.stringify(payload);
  const base64Payload = Buffer.from(payloadStr).toString("base64url");
  const signature = await generateSignature(base64Payload, SESSION_SECRET);

  return `${base64Payload}.${signature}`;
}

/**
 * Verifies a session token and returns the admin user if valid
 */
export async function verifySessionToken(token: string | null | undefined): Promise<AdminUser | null> {
  if (!token) return null;

  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;

    const [base64Payload, signature] = parts;
    const expectedSignature = await generateSignature(base64Payload, SESSION_SECRET);

    if (signature !== expectedSignature) {
      return null;
    }

    const payloadJson = Buffer.from(base64Payload, "base64url").toString("utf-8");
    const payload = JSON.parse(payloadJson);

    if (!payload.username || !payload.exp) return null;

    if (Date.now() > payload.exp) {
      return null; // Expired
    }

    const account = ADMIN_USERS[payload.username];
    if (!account) return null;

    return account.user;
  } catch (err) {
    return null;
  }
}

/**
 * Generates an HMAC SHA-256 signature
 */
async function generateSignature(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const msgData = encoder.encode(data);

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signatureBuffer = await crypto.subtle.sign("HMAC", cryptoKey, msgData);
  const signatureArray = Array.from(new Uint8Array(signatureBuffer));
  return signatureArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Checks if a request is authenticated from cookies or Authorization header
 */
export async function getAdminFromRequest(request: NextRequest): Promise<AdminUser | null> {
  const cookieToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (cookieToken) {
    const user = await verifySessionToken(cookieToken);
    if (user) return user;
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    return await verifySessionToken(token);
  }

  return null;
}

export { SESSION_COOKIE_NAME };
