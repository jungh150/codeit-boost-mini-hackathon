import express from 'express';
import placeRoutes from './routes/placeRoutes.js'; // 확장자 명시하기
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000; // PORT는 대문자

app.use(express.json());
app.use('/places', placeRoutes);

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on ${PORT}`);
});