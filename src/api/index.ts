import express from "express";

import MessageResponse from "../interfaces/MessageResponse";
import user from "./user";
import authRoute from "./authRoute";
import tweetRoute from "./tweetRoute";

const router = express.Router();

router.get<{}, MessageResponse>("/", (req, res) => {
  try {
    res.json({
      message: "Welocome to Dzanibe Media custom authentication demo project",
    });
  } catch (error) {
    console.log({ error });
  }
});

router.use("/user", user);
router.use("/authenticate", authRoute);
router.use("/tweet", tweetRoute);

export default router;
