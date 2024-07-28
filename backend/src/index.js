import express from 'express';
import placeRoutes from './routes/placeRoutes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.port || 3000;

app.use(express.json());
app.use('/places', placeRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});