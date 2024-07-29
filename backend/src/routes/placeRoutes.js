import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
// import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import asyncHandler from '../utils/asyncHandler.js'; // 1. 비동기 핸들러 래퍼 가져오기

const prisma = new PrismaClient();
const placeRouter = express.Router();
placeRouter.use(express.json());

import session from 'express-session'; // 4
import FileStore from 'session-file-store'; // 5
import passport from 'passport';   // 1

const fileStore = FileStore(session); // 6
const sessionSecret = process.env.SESSION_SECRET; // 7

// 미들웨어 설정 // 8
placeRouter.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: new fileStore({ path: './sessions' }) // 세션 파일 저장 경로 설정
  }));

// 미들웨어 설정  // 2
placeRouter.use(passport.initialize());
placeRouter.use(passport.session());

passport.serializeUser((user, done) => done(null, user)); // 9
passport.deserializeUser((user, done) => done(null, user)); // 10

// 로그인 확인 미들웨어 // 3
const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.status(401).json({ message: 'You need to be logged in to access this resource.' });
    }
  };

// 여행지 생성 수정 삭제 : userId도 함께 받아서 누가 생성했는지 알면 좋을텐데..
// 여행지 생성
placeRouter.post('/', ensureAuthenticated, asyncHandler(async (req, res) => { // 2. 비동기 핸들러로 감싸주기
        const { name, description, location, rating } = req.body;
        const newPlace = await prisma.place.create({
            data: {
                name,  // string
                description, // string
                location, // latitude, longitude 포함 json
                rating // float
            }
        }); 

        res.status(201).json(newPlace);

}));

// 여행지 수정
placeRouter.put('/:placeId', ensureAuthenticated, asyncHandler(async (req, res) => {
        const { placeId } = req.params;
        const { name, description, location, rating } = req.body;

        const updateData = {};
        if( name ) updateData.name = name; // req body에 일부 필드만 오더라도 수정 가능
        if( description ) updateData.description = description;
        if( location ) updateData.location = location;
        if( rating ) updateData.rating = rating;

        const updatedPlace = await prisma.place.update({
            where: { id: placeId },
            data: updateData // 중괄호 넣으면 안 됨
        });
        res.status(200).json(updatedPlace);
}));

// 여행지 삭제
placeRouter.delete('/:placeId', ensureAuthenticated, asyncHandler(async (req, res) => {

        const { placeId } = req.params;

        await prisma.place.delete({
            where: { id: placeId }
        });

        res.status(200).json({ message: "successfully deleted" }); // 상태코드 204는 바디 못보냄, send보다 json으로 하는게 일관성있음

})); // 세미콜론 잊지말기

// 여행지 검색
router.get('/', asyncHandler(async (req, res) => {
        const { name, description, rating } = req.query;

        const where = {};
        if ( name ) where.name = { contains: name }; // insensitive mode(대소문자 구분 없이 검색) 오류나서 못 씀
        if ( description ) where.description = { contains: description };
        if ( rating ) where.rating = { gte: parseFloat(rating) };

        const places = await prisma.place.findMany({
            where
        });

        res.status(200).json(places);

}));

// 여행지 목록 조회
router.get('/', asyncHandler(async (req, res) => {
        const places = await prisma.place.findMany();
        res.status(200).json(places); 
}));

// 여행지 상세 조회
router.get('/:placeId', asyncHandler(async (req, res) => {

        const { placeId } = req.params;
        const place = await prisma.place.findUnique({
            where: { id: placeId }
        });
        if(!place){
            return res.status(404).json({ message: 'Place not found'}); // return - 함수 실행을 명확히 종료시킴
        } else{
            res.status(200).json(place);
        }

}));

// 여행지 찜 등록
placeRouter.post('/:placeId/wish', ensureAuthenticated, asyncHandler(async (req, res) => {
    const { placeId } = req.params;
    const { userId, comment } = req.body;
    const newWish = await prisma.wish.create({
        data: {
            userId,
            placeId,
            comment
        }
    });
    res.status(201).json(newWish);
}));

// 여행지 찜 삭제
placeRouter.delete('/:placeId/wish', ensureAuthenticated, asyncHandler(async (req, res) => {
    const { placeId } = req.params;
    const { userId } = req.body;
    await prisma.wish.deleteMany({ // many가 안전하기는 할 듯.. 다른데서 확실히 1대1 보장받는거 아니면
        where: {
            userId,
            placeId // 순서 안중요
        }
    });
    res.status(200).json({message: "성공적으로 삭제되었습니다."});
}));

export default router;