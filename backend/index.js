import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import session from 'express-session';
import FileStore from 'session-file-store';
import passport from 'passport';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';

// FileStore를 세션에 연결
const fileStore = FileStore(session);

// Google Client 관련 정보
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

const app = express();

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

// 미들웨어 설정
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: 'keyboard cat',
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

// Passport (Google) - 구글 로그인시 정보 GET
passport.use(new GoogleStrategy({
  clientID: googleCredentials.web.client_id,
  clientSecret: googleCredentials.web.client_secret,
  callbackURL: googleCredentials.web.redirect_uris[0]
},
  (accessToken, refreshToken, profile, done) => {
    console.log(profile);
    // 사용자 정보가 이미 데이터베이스에 있는지 확인
    let user =  users.find(userInfo => userInfo.email === profile.emails[0].value);
    if (user) {
      // 사용자 정보 업데이트
      user.provider = profile.provider;
      user.providerId = profile.id;
      user.token = accessToken;
      user.name = profile.displayName;
    } else {
      // 새로운 사용자 정보 추가
      user = {
        id:  users.length + 1, // 고유 ID 할당 (랜덤 값 필요 시 shortid.generate() 사용)
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
app.get('/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] }));

// 구글 로그인 후 콜백 URL (원래 웹사이트로 돌아옴)
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/login' }),
  (req, res) => res.redirect('/'));

// 홈페이지 생성 (req.user는 passport의 직렬화된 사용자 정보가 저장됨)
app.get('/', (req, res) => {
  const temp = getPage('Welcome', 'Welcome to visit...', getBtn(req.user));
  res.send(temp);
});

// 로그아웃 페이지: 로그아웃 처리, 세션 삭제 및 쿠키 삭제 후 홈으로 리다이렉션
// passport 패키지 내 req.logout()으로 로그아웃 기능 구현
app.get('/auth/logout', (req, res, next) => {
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
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err); // 이미 헤더가 전송된 경우, 다음 에러 핸들러로 전달
  }
  res.status(500).send(err.message || 'Internal Server Error');
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