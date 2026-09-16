import { Router, type IRouter } from "express";
import healthRouter from "./health";
import fposRouter from "./fpos";
import authRouter from "./auth";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(fposRouter);

export default router;
