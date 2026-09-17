import {
  createHmac,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";
import type { NextFunction, Request, RequestHandler, Response } from "express";
import { eq, lt } from "drizzle-orm";
import { db } from "@workspace/db";
import { authSessions } from "@workspace/db/schema";

export type AuthRole = "farmer" | "fpo" | "admin";

export type AuthUser = {
  id: string;
  role: AuthRole;
  displayName: string;
  identity: string;
};

type Account = AuthUser & {
  passwordHash: Buffer;
  passwordSalt: Buffer;
};

declare global {
  namespace Express {
    interface Request {
      auth?: AuthUser;
    }
  }
}

const SESSION_COOKIE = "agri_session";
const SESSION_TTL_MS = 8 * 60 * 60 * 1000;
const REMEMBERED_SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const isProduction = process.env.NODE_ENV === "production";
const sessionSecret = process.env.SESSION_SECRET ?? "local-development-session-secret";

if (isProduction && !process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET must be set in production.");
}

function normalizeIdentity(identity: string): string {
  const trimmed = identity.trim();
  return trimmed.includes("@")
    ? trimmed.toLowerCase()
    : trimmed.replace(/[^\d+]/g, "");
}

function passwordFor(role: AuthRole): string {
  const envKey = role === "fpo"
    ? "FPO_LOGIN_PASSWORD"
    : role === "admin"
      ? "REVIEWER_LOGIN_PASSWORD"
      : "FARMER_LOGIN_PASSWORD";
  return process.env[envKey] ?? (role === "fpo" ? "fpo123" : role === "admin" ? "review123" : "farmer123");
}

function identityFor(role: AuthRole): string {
  const envKey = role === "fpo"
    ? "FPO_LOGIN_IDENTITY"
    : role === "admin"
      ? "REVIEWER_LOGIN_IDENTITY"
      : "FARMER_LOGIN_IDENTITY";
  return process.env[envKey] ?? (
    role === "fpo"
      ? "secretary@sahyadrifpo.in"
      : role === "admin"
        ? "reviewer@agri.gov.in"
        : "+91 98765 43210"
  );
}

function createAccount(
  id: string,
  role: AuthRole,
  displayName: string,
): Account {
  const passwordSalt = Buffer.from(`${sessionSecret}:${role}:password`, "utf8");
  const passwordHash = scryptSync(passwordFor(role), passwordSalt, 32);
  const identity = identityFor(role);
  return {
    id,
    role,
    displayName,
    identity,
    passwordHash,
    passwordSalt,
  };
}

const accounts: Account[] = [
  createAccount("farmer-ravi", "farmer", "Ravi Kumar"),
  createAccount("fpo-nandini", "fpo", "Nandini Gowda"),
  createAccount("reviewer-asha", "admin", "Asha Menon"),
];

function publicUser(account: Account): AuthUser {
  return {
    id: account.id,
    role: account.role,
    displayName: account.displayName,
    identity: account.identity,
  };
}

function verifyPassword(account: Account, password: string): boolean {
  const candidate = scryptSync(password, account.passwordSalt, 32);
  return candidate.length === account.passwordHash.length && timingSafeEqual(candidate, account.passwordHash);
}

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: isProduction,
    path: "/",
    maxAge,
  };
}

function sessionTokenHash(token: string): string {
  return createHmac("sha256", sessionSecret).update(token).digest("hex");
}

async function purgeExpiredSessions(now = new Date()): Promise<void> {
  await db.delete(authSessions).where(lt(authSessions.expiresAt, now));
}

export function authenticate(identity: string, password: string, role: AuthRole): AuthUser | null {
  const account = accounts.find(
    (candidate) =>
      candidate.role === role &&
      normalizeIdentity(candidate.identity) === normalizeIdentity(identity),
  );

  if (!account || !verifyPassword(account, password)) {
    return null;
  }

  return publicUser(account);
}

export async function createSession(res: Response, user: AuthUser, rememberMe: boolean): Promise<void> {
  const token = randomBytes(32).toString("base64url");
  const maxAge = rememberMe ? REMEMBERED_SESSION_TTL_MS : SESSION_TTL_MS;
  await purgeExpiredSessions();
  await db.insert(authSessions).values({
    tokenHash: sessionTokenHash(token),
    userId: user.id,
    role: user.role,
    displayName: user.displayName,
    identity: user.identity,
    expiresAt: new Date(Date.now() + maxAge),
  });
  res.cookie(SESSION_COOKIE, token, cookieOptions(maxAge));
}

export async function destroySession(req: Request, res: Response): Promise<void> {
  const token = req.cookies?.[SESSION_COOKIE];
  if (typeof token === "string") {
    await db.delete(authSessions).where(eq(authSessions.tokenHash, sessionTokenHash(token)));
  }
  res.clearCookie(SESSION_COOKIE, cookieOptions(0));
}

export async function currentUser(req: Request): Promise<AuthUser | null> {
  const token = req.cookies?.[SESSION_COOKIE];
  if (typeof token !== "string") return null;

  const tokenHash = sessionTokenHash(token);
  await purgeExpiredSessions();
  const [session] = await db
    .select()
    .from(authSessions)
    .where(eq(authSessions.tokenHash, tokenHash))
    .limit(1);
  if (!session) return null;
  if (session.expiresAt.getTime() <= Date.now()) {
    await db.delete(authSessions).where(eq(authSessions.tokenHash, tokenHash));
    return null;
  }
  return {
    id: session.userId,
    role: session.role,
    displayName: session.displayName,
    identity: session.identity,
  };
}

export function requireAuth(): RequestHandler {
  return async (req, res, next): Promise<void> => {
    const user = await currentUser(req);
    if (!user) {
      res.status(401).json({ error: "Authentication required." });
      return;
    }
    req.auth = user;
    next();
  };
}

export function requireRole(...roles: AuthRole[]): RequestHandler {
  return (req, res, next): void => {
    if (!req.auth || !roles.includes(req.auth.role)) {
      res.status(403).json({ error: "This workspace is not available for your role." });
      return;
    }
    next();
  };
}