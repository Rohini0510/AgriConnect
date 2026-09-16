import { Router, type IRouter } from "express";
import {
  SignInBody,
  SignInResponse,
  GetAuthSessionResponse,
} from "@workspace/api-zod";
import {
  authenticate,
  createSession,
  currentUser,
  destroySession,
  type AuthRole,
} from "../lib/auth";

const router: IRouter = Router();

router.post("/auth/sign-in", (req, res): void => {
  res.setHeader("Cache-Control", "no-store");
  const input = SignInBody.safeParse(req.body);
  if (!input.success) {
    res.status(400).json({ error: "Enter a valid identity and password to continue." });
    return;
  }

  const user = authenticate(input.data.identity, input.data.password, input.data.role as AuthRole);
  if (!user) {
    res.status(401).json({ error: "The identity or password does not match this workspace." });
    return;
  }

  createSession(res, user, input.data.rememberMe ?? false);
  res.json(SignInResponse.parse({ authenticated: true, user }));
});

router.get("/auth/session", (req, res): void => {
  res.setHeader("Cache-Control", "no-store");
  const user = currentUser(req);
  res.json(GetAuthSessionResponse.parse({ authenticated: Boolean(user), user }));
});

router.post("/auth/sign-out", (req, res): void => {
  res.setHeader("Cache-Control", "no-store");
  destroySession(req, res);
  res.sendStatus(204);
});

export default router;