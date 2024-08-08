import { Router } from "express";

import MessageResponse from "../interfaces/MessageResponse";
import user from "./user";
import authRoute from "./authRoute";
import tweetRoute from "./tweetRoute";

const router = Router();

router.use("/user", user);
router.use("/authenticate", authRoute);
router.use("/tweet", tweetRoute);

router.get<{}, MessageResponse>("/", (req, res) => {
  try {
    res.json({
      message: "Welocome to Dzanibe Media custom authentication demo project",
    });
  } catch (error) {
    console.log({ error });
  }
});

export default router;
