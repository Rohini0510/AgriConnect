import { Router, type IRouter } from "express";
import healthRouter from "./health";
import fposRouter from "./fpos";

const router: IRouter = Router();

router.use(healthRouter);
router.use(fposRouter);

export default router;
