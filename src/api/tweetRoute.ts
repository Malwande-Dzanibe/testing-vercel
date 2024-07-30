import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import Jwt from "jsonwebtoken";

const router = Router();

const prisma = new PrismaClient();

router.post("/", async (req, res) => {
  //@ts-ignore
  res.setHeader("Access-Control-Allow-Credentials", true);
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

  const content: string = req.body.content;

  const auth = req.headers["authorization"];

  const jwtoken = auth?.split(" ")[1];

  try {
    if (!jwtoken) {
      return res.sendStatus(401);
    }

    const payLoad = Jwt.verify(jwtoken, process.env.JWT_SECRET as string) as {
      id: string;
    };

    const apiToken = await prisma.token.findUnique({
      where: {
        id: payLoad.id,
      },
      include: {
        user: true,
      },
    });

    if (!apiToken?.isValid || apiToken.expiration < new Date()) {
      return res.status(401).json({ message: "API token expired" });
    }

    const tweet = await prisma.post.create({
      data: {
        content,
        userId: apiToken?.user.id,
      },
      include: {
        user: true,
      },
    });

    res.status(200).json(tweet);
  } catch (error) {
    res.status(401).json({
      message: error,
    });
  }
});

export default router;
