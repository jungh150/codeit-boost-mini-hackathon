import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { PrismaClient } from '@prisma/client';
import asyncHandler from '../utils/asyncHandler.js';

const prisma = new PrismaClient();
const userRouter = express.Router();
userRouter.use(express.json());

import session from 'express-session';
import FileStore from 'session-file-store';
import passport from 'passport';

const fileStore = FileStore(session);
const sessionSecret = process.env.SESSION_SECRET;

// 미들웨어 설정
userRouter.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  store: new fileStore({ path: './sessions' }) // 세션 파일 저장 경로 설정
}));

userRouter.use(passport.initialize());
userRouter.use(passport.session());

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// 전체 사용자 조회
userRouter.get('/', asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany();
  res.send(users);
}));

// 특정 사용자 조회
// userRouter.get('/:email', asyncHandler(async (req, res) => {
//   console.log(req.user);
//   const { email } = req.params;
//   const user = await prisma.user.findUnique({
//     where: { email },
//   });
//   if (user) {
//     res.send(user);
//   } else {
//     res.status(404).send({ message: 'Cannot find given email.' });
//   }
// }));

// 내 정보 조회
userRouter.get('/my', asyncHandler(async (req, res) => {
  const myEmail = req.user.email;
  console.log(myEmail);
  const user = await prisma.user.findUnique({
    where: { email: myEmail },
  });
  if (user) {
    res.send(user);
  } else {
    res.status(404).send({ message: 'Cannot find given email.' });
  }
}));

// 사용자의 찜 전체 조회
// userRouter.get('/:email/wishes', asyncHandler(async (req, res) => {
//   const { email } = req.params;
//   const user = await prisma.user.findUnique({
//     where: { email },
//     include: {
//       wishes: true,
//     },
//   });
//   if (user) {
//     res.send(user.wishes);
//   } else {
//     res.status(404).send({ message: 'Cannot find given email.' });
//   }
// }));

// 내 찜 전체 조회
userRouter.get('/my/wishes', asyncHandler(async (req, res) => {
  const myEmail = req.user.email;
  console.log(myEmail);
  const user = await prisma.user.findUnique({
    where: { email: myEmail },
    include: {
      wishes: true,
    },
  });
  if (user) {
    res.send(user.wishes);
  } else {
    res.status(404).send({ message: 'Cannot find given email.' });
  }
}));

// 사용자의 찜 상세 조회
// userRouter.get('/:email/wishes/:wishId', asyncHandler(async (req, res) => {
//   const { email, wishId } = req.params;
//   const user = await prisma.user.findUnique({
//     where: { email },
//     include: {
//       wishes: true,
//     },
//   });
//   const wish = user.wishes.findUnique({
//     where: { id: wishId },
//   });
//   if (wish) {
//     res.send(wish);
//   } else {
//     res.status(404).send({ message: 'Cannot find wish.' });
//   }
// }));

// 내 찜 상세 조회
userRouter.get('/:email/wishes/:wishId', asyncHandler(async (req, res) => {
  const myEmail = req.user.email;
  console.log(myEmail);
  const user = await prisma.user.findUnique({
    where: { email: myEmail },
    include: {
      wishes: true,
    },
  });
  const wish = user.wishes.findUnique({
    where: { id: wishId },
  });
  if (wish) {
    res.send(wish);
  } else {
    res.status(404).send({ message: 'Cannot find wish.' });
  }
}));

// 사용자 생성
userRouter.post('/', asyncHandler(async (req, res) => {
  const user = await prisma.user.create({
    data: req.body,
  });
  res.status(201).send(user);
}));

// 사용자 수정
// userRouter.patch('/:email', asyncHandler(async (req, res) => {
//   const { email } = req.params;
//   console.log(req.body);
//   const user = await prisma.user.update({
//     where: { email },
//     data: req.body,
//   });
//   res.send(user);
// }));

// 내 정보 수정
userRouter.patch('/my', asyncHandler(async (req, res) => {
  const myEmail = req.user.email;
  console.log(myEmail);
  console.log(req.body);
  const user = await prisma.user.update({
    where: { email: myEmail },
    data: req.body,
  });
  res.send(user);
}));

// 사용자 삭제
userRouter.delete('/:email', asyncHandler(async (req, res) => {
  const { email } = req.params;
  await prisma.user.delete({
    where: { email },
  });
  res.sendStatus(204);
}));

export default userRouter;