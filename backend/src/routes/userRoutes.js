import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { PrismaClient } from '@prisma/client';
import asyncHandler from '../utils/asyncHandler.js';

const prisma = new PrismaClient();
const userRouter = express.Router();
userRouter.use(express.json());

// 전체 유저 조회
userRouter.get('/', asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany();
  res.send(users);
}));

// 특정 유저 조회
userRouter.get('/:email', asyncHandler(async (req, res) => {
  const { email } = req.params;
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (user) {
    res.send(user);
  } else {
    res.status(404).send({ message: 'Cannot find given email.' });
  }
}));

// 유저 생성
userRouter.post('/', asyncHandler(async (req, res) => {
  const user = await prisma.user.create({
    data: req.body,
  });
  res.status(201).send(user);
}));

// 유저 수정
userRouter.patch('/:email', asyncHandler(async (req, res) => {
  const { email } = req.params;
  console.log(req.body);
  const user = await prisma.user.update({
    where: { email },
    data: req.body,
  });
  res.send(user);
}));

// 유저 삭제
userRouter.delete('/:email', asyncHandler(async (req, res) => {
  const { email } = req.params;
  await prisma.user.delete({
    where: { email },
  });
  res.sendStatus(204);
}));

export default userRouter;