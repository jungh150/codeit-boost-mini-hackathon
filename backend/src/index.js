const express = require('express');
const mongoose = require('mongoose');
const placeRoutes = require('./routes/placeRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어 설정
app.use(express.json());

// 라우트 설정
app.use('/places', placeRoutes);

// 데이터베이스 연결
mongoose.connect('mongodb://localhost:27017/travel', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
    // 서버 시작
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.error('Database connection error:', error);
});
