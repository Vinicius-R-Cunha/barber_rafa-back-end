import { Router } from "express";
import authRouter from "./authRouter.js";
import calendarRouter from "./calendarRouter.js";
import categoryRouter from "./categoryRouter.js";
import oAuthRouter from "./oAuthRouter.js";
import reservationRouter from "./reservationRouter.js";
import resetPasswordRouter from "./resetPasswordRouter.js";
import scheduleRouter from "./scheduleRouter.js";
import serviceRouter from "./serviceRouter.js";
import userRouter from "./userRouter.js";

const router = Router();
router.use(authRouter);
router.use(categoryRouter);
router.use(serviceRouter);
router.use(calendarRouter);
router.use(scheduleRouter);
router.use(reservationRouter);
router.use(resetPasswordRouter);
router.use(oAuthRouter);
router.use(userRouter);

export default router;
