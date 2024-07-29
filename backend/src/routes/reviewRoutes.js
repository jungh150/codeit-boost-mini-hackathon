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

    // 여행지 평점 업데이트 함수
async function updatePlaceRating(placeId) {
    const reviews = await prisma.review.findMany({
        where: { placeId },
        select: { rating: true }
    });

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const avgRating = totalRating / reviews.length;

    await prisma.place.update({
        where: { id: placeId },
        data: { rating: avgRating }
    });
}

// 여행지 리뷰 수정
reviewRouter.put('/:reviewId', ensureAuthenticated, asyncHandler(async (req, res) => {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    const data = {};
    if(rating) data.rating = rating;
    if(comment) data.comment = comment;

    // 해당 리뷰를 먼저 조회하여 placeId를 가져옴
    const review = await prisma.review.findUnique({
        where: { id: reviewId },
        select: { placeId: true }
    });

    if (!review) {
        return res.status(404).json({ message: 'Review not found' });
    }

    const updatedReview = await prisma.review.update({
        where: {
            id: reviewId
        }, 
        data
    });

    // 평균 평점 업데이트
    await updatePlaceRating(review.placeId);

    res.status(200).json(updatedReview);
}));

// 여행지 리뷰 삭제
reviewRouter.delete('/:reviewId', ensureAuthenticated, asyncHandler(async (req, res) => {
    const { reviewId } = req.params;

    // 해당 리뷰를 먼저 조회하여 placeId를 가져옴
    const review = await prisma.review.findUnique({
        where: { id: reviewId },
        select: { placeId: true }
    });

    if (!review) {
        return res.status(404).json({ message: 'Review not found' });
    }

    const placeId = review.placeId;
    
    await prisma.review.deleteMany({
        where: {
            id: reviewId
        }
    });

    // 평균 평점 업데이트
    await updatePlaceRating(placeId);

    res.status(200).json({message: "성공적으로 삭제되었습니다."});
}));

// 여행지 리뷰 상세 조회
reviewRouter.get('/:reviewId', asyncHandler(async (req, res) => {

    const { reviewId } = req.params;
    const review = await prisma.review.findUnique({
        where: { id: reviewId }
    });
    if(!review){
        return res.status(404).json({ message: 'Review not found'});
    } else{
        res.status(200).json(review);
    }
}));

export default reviewRouter;