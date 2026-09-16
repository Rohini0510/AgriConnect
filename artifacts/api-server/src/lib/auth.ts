import {
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";
import type { NextFunction, Request, RequestHandler, Response } from "express";

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

type Session = {
  user: AuthUser;
  expiresAt: number;
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

const sessions = new Map<string, Session>();

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

export function createSession(res: Response, user: AuthUser, rememberMe: boolean): void {
  const token = randomBytes(32).toString("base64url");
  const maxAge = rememberMe ? REMEMBERED_SESSION_TTL_MS : SESSION_TTL_MS;
  sessions.set(token, { user, expiresAt: Date.now() + maxAge });
  res.cookie(SESSION_COOKIE, token, cookieOptions(maxAge));
}

export function destroySession(req: Request, res: Response): void {
  const token = req.cookies?.[SESSION_COOKIE];
  if (typeof token === "string") {
    sessions.delete(token);
  }
  res.clearCookie(SESSION_COOKIE, cookieOptions(0));
}

export function currentUser(req: Request): AuthUser | null {
  const token = req.cookies?.[SESSION_COOKIE];
  if (typeof token !== "string") return null;

  const session = sessions.get(token);
  if (!session) return null;
  if (session.expiresAt <= Date.now()) {
    sessions.delete(token);
    return null;
  }
  return session.user;
}

export function requireAuth(): RequestHandler {
  return (req, res, next): void => {
    const user = currentUser(req);
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