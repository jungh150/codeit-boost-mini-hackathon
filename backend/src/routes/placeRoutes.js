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

// 여행지 삭제
router.delete('/:placeId', async (req, res) => {
    try {
        const { placeId } = req.params;

        await prisma.place.delete({
            where: { id: placeId }
        });

        res.status(200).json({ message: "successfully deleted" }); // 상태코드 204는 바디 못보냄, send보다 json으로 하는게 일관성있음
    } catch ( error ){
        res.status(500).json({ message: error.message });
    }
}); // 세미콜론 잊지말기

// 여행지 검색
router.get('/', async (req, res) => {
    try {
        const { name, description, rating } = req.query;

        const where = {};
        if ( name ) where.name = { contains: name }; // insensitive mode(대소문자 구분 없이 검색) 오류나서 못 씀
        if ( description ) where.description = { contains: description };
        if ( rating ) where.rating = { gte: parseFloat(rating) };

        const places = await prisma.place.findMany({
            where
        });

        res.status(200).json(places);
    } catch ( error ){
        res.status(500).json({ message: error.message });
    }
});

// 여행지 목록 조회
router.get('/', async (req, res) => {
    try {
        const places = await prisma.place.findMany();
        res.status(200).json(places); 
    } catch ( error ) {
        res.status(400).json({ message: error.message });
    }
});

// 여행지 상세 조회
router.get('/:placeId', async (req, res) => {
    try{
        const { placeId } = req.params;
        const place = await prisma.place.findUnique({
            where: { id: placeId }
        });
        if(!place){
            return res.status(404).json({ message: 'Place not found'}); // return?
        } else{
            res.status(200).json(place);
        }

    } catch ( error ){
        res.status(500).json({ message: error.message });
    }
});


export default router;