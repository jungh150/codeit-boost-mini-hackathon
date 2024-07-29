import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { PrismaClient } from '@prisma/client';
import asyncHandler from '../utils/asyncHandler.js';

const prisma = new PrismaClient();
const reviewRouter = express.Router();
reviewRouter.use(express.json());

import session from 'express-session';
import FileStore from 'session-file-store';
import passport from 'passport';

const fileStore = FileStore(session);
const sessionSecret = process.env.SESSION_SECRET;

// 미들웨어 설정
reviewRouter.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: new fileStore({ path: './sessions' }) // 세션 파일 저장 경로 설정
  }));


reviewRouter.use(passport.initialize());
reviewRouter.use(passport.session());

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// 로그인 확인 미들웨어
const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.status(401).json({ message: 'You need to be logged in to access this resource.' });
    }
  };

// 여행지 리뷰 수정
reviewRouter.put('/:reviewId', ensureAuthenticated, asyncHandler(async (req, res) => {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    const data = {};
    if(rating) data.rating = rating;
    if(comment) data.comment = comment;

    const updatedReview = await prisma.review.update({
        where: {
            id: reviewId
        }, 
        data
    });
    res.status(200).json(updatedReview);
}));

// 여행지 리뷰 삭제
reviewRouter.delete('/:reviewId', ensureAuthenticated, asyncHandler(async (req, res) => {
    const { reviewId } = req.params;
    await prisma.review.deleteMany({
        where: {
            id: reviewId
        }
    });
    res.status(200).json({message: "성공적으로 삭제되었습니다."});
}));

export default reviewRouter;