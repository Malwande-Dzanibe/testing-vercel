import express from "express";

import MessageResponse from "../interfaces/MessageResponse";
import user from "./user";
import authRoute from "./authRoute";
import tweetRoute from "./tweetRoute";

const router = express.Router();

router.get<{}, MessageResponse>("/", (req, res) => {
  // res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  res.json({
    message: "Welocome to Dzanibe Media custom authentication demo project",
  });
});

router.use("/user", user);
router.use("/authenticate", authRoute);
router.use("/tweet", tweetRoute);

export default router;
