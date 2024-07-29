import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import session from 'express-session';
import FileStore from 'session-file-store';
import passport from 'passport';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
app.use(express.json());

import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import placeRouter from './routes/placeRoutes.js';
import travelRouter from './routes/travelRoutes.js';


// 라우트 설정
app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/places', placeRouter);
app.use('/travels', travelRouter);

const fileStore = FileStore(session);
const sessionSecret = process.env.SESSION_SECRET;

// 미들웨어 설정
app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  store: new fileStore({ path: './sessions' }) // 세션 파일 저장 경로 설정
}));

// Passport 미들웨어 초기화
app.use(passport.initialize());
app.use(passport.session());

// Passport의 직렬화 및 역직렬화 설정
// serializeUser : 로그인 / 회원가입 후 1회 실행
// deserializeUser : 페이지 전환시 마다 실행 
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// 홈페이지 생성 (req.user는 passport의 직렬화된 사용자 정보가 저장됨)
app.get('/', (req, res) => {
  const temp = getPage('Welcome', 'Welcome to visit...', getBtn(req.user));
  res.send(temp);
});

// 로그인/로그아웃 상태에 따른 버튼 생성
const getBtn = (user) => {
  return user !== undefined ? `${user.name} | <a href="/auth/logout">logout</a>` : `<a href="/auth/google">Google Login</a>`;
}

// 페이지 생성 함수
const getPage = (title, description, auth) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
    </head>
    <body>
      ${auth}
      <h1>${title}</h1>
      <p>${description}</p>
    </body>
    </html>
    `;
}

// 서버 시작
app.listen(3000, () => console.log('http://localhost:3000'));
