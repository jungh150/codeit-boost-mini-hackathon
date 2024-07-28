import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// 여행지 생성
router.post('/', async (req, res) => {
    try{
        const { name, description, location, rating } = req.body;
        const newPlace = await prisma.place.create({
            data: {
                name, 
                description, 
                location, 
                rating
            }
        });

        res.status(201).json(newPlace);
    } catch (error){
        res.status(400).json({ message: error.message });
    }
});

export default router;