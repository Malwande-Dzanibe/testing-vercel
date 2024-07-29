import express from "express";

import user from "./user";
import authRoute from "./authRoute";
import tweetRoute from "./tweetRoute";

const router = express.Router();

router.use("/user", user);
router.use("/authenticate", authRoute);
router.use("/tweet", tweetRoute);

export default router;
