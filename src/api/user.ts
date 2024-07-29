import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import sendEmails from "../utils/sendEmail";

const router = Router();

const prisma = new PrismaClient();

const generateEmailToken = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

router.post("/register", async (req, res) => {
  const email = req.body.email;
  let password = req.body.password;
  let confirmpassword = req.body.confirmpassword;
  const name = req.body.name;
  const surname = req.body.surname;

  const emailToken = generateEmailToken();

  const expiration = new Date(new Date().getTime() + 1000 * 60 * 10);

  let user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (user) {
    return res.status(401).json({
      message: `${email} already exists`,
    });
  }

  if (confirmpassword !== password) {
    return res.status(401).json({
      message: "Passwords do not match",
    });
  }

  if (password.length < 8) {
    return res.status(401).json({
      message: "Your password should be atleast more than 8 characters",
    });
  }

  const salt = await bcrypt.genSalt(10);

  password = await bcrypt.hash(req.body.password, salt);
  confirmpassword = await bcrypt.hash(req.body.confirmpassword, salt);

  user = await prisma.user.create({
    data: {
      name,
      confirmpassword,
      email,
      password,
      surname,
    },
  });

  const tokenToEmail = await prisma.token.create({
    data: {
      emailToken,
      expiration,
      type: "EMAIL",
      userId: user.id,
    },
    include: {
      user: true,
    },
  });

  sendEmails(user, tokenToEmail);

  res.status(200).json(tokenToEmail);
});

router.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const expiration = new Date(new Date().getTime() + 1000 * 60 * 10);
  const emailToken = generateEmailToken();

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return res.status(401).json({
      message: `We do not have a user by the email of ${email}`,
    });
  }

  const isPasswordMatching = await bcrypt.compare(password, user?.password);

  if (!isPasswordMatching) {
    return res.status(401).json({
      message: "Incorrect Password",
    });
  }

  const tokenToEmail = await prisma.token.create({
    data: {
      emailToken,
      expiration,
      type: "EMAIL",
      userId: user.id,
    },
    include: {
      user: true,
    },
  });

  sendEmails(user, tokenToEmail);

  res.status(200).json(tokenToEmail);
});

export default router;
