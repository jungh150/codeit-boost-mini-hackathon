import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const authRouter = express.Router();

import passport from 'passport';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';

// Google Client 관련 정보
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

// 사용자 정보 데이터베이스 (추후에 데이터베이스로 대체)
const users = [{
  id: '1',
  email: 'goodmemory@tistory.com',
  password: 'goodmemory',
  name: 'goodmemory',
  provider: '',
  token: '',
  providerId: ''
}];

// 구글 API ID, Secret 정보 저장 (구글 개발자 웹사이트에서 발급받은 클라이언트 ID와 시크릿 입력)
const googleCredentials = {
  "web": {
    "client_id": googleClientId,
    "client_secret": googleClientSecret,
    "redirect_uris": [
      "http://localhost:3000/auth/google/callback"
    ]
  }
}

// Passport (Google) - 구글 로그인시 정보 GET
passport.use(new GoogleStrategy({
  clientID: googleCredentials.web.client_id,
  clientSecret: googleCredentials.web.client_secret,
  callbackURL: googleCredentials.web.redirect_uris[0]
},
  (accessToken, refreshToken, profile, done) => {
    console.log(profile);
    // 사용자 정보가 이미 데이터베이스에 있는지 확인
    let user = users.find(userInfo => userInfo.email === profile.emails[0].value);
    if (user) {
      // 사용자 정보 업데이트
      user.provider = profile.provider;
      user.providerId = profile.id;
      user.token = accessToken;
      user.name = profile.displayName;
    } else {
      // 새로운 사용자 정보 추가
      user = {
        id: users.length + 1, // 고유 ID 할당 (랜덤 값 필요 시 shortid.generate() 사용)
        provider: profile.provider,
        providerId: profile.id,
        token: accessToken,
        name: profile.displayName,
        email: profile.emails[0].value
      }
      users.push(user);
    }
    return done(null, user);
  }
));

// 구글 로그인 버튼 클릭 시 구글 인증 페이지로 이동
authRouter.get('/google',
  passport.authenticate('google', { scope: ['email', 'profile'] }));

// 구글 로그인 후 콜백 URL (원래 웹사이트로 돌아옴)
authRouter.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/login' }),
  (req, res) => res.redirect('/'));

// 로그아웃 페이지: 로그아웃 처리, 세션 삭제 및 쿠키 삭제 후 홈으로 리다이렉션
// passport 패키지 내 req.logout()으로 로그아웃 기능 구현
authRouter.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err); // 에러가 발생하면 next(err)로 에러 핸들러로 전달
    }
    req.session.destroy((err) => {
      if (err) {
        return next(err); // 에러가 발생하면 next(err)로 에러 핸들러로 전달
      }
      res.clearCookie('connect.sid');
      res.redirect('/');
    });
  });
});

// 에러 핸들러
authRouter.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err); // 이미 헤더가 전송된 경우, 다음 에러 핸들러로 전달
  }
  res.status(500).send(err.message || 'Internal Server Error');
});

export default authRouter;