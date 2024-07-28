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
                name,  // string
                description, // string
                location, // latitude, longitude 포함 json
                rating // float
            }
        });

        res.status(201).json(newPlace);
    } catch (error){
        res.status(400).json({ message: error.message });
    }
});

// 여행지 수정
router.put('/:placeId', async (req, res) => {
    try{
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
    } catch (error){
        res.status(400).json({ message: error.message });
    }
});

export default router;