import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';

import authRouter from './routes/authRoutes.js';

const app = express();

// 미들웨어 설정
app.use(express.json());

// 라우트 설정
app.use('/auth', authRouter);

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