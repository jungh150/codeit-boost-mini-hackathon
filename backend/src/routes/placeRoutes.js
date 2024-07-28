const express = require('express');
const router = express.Router();
const Place = require('../models/placeModel');

// 여행지 생성
router.post('/', async (req, res) => {
    try {
        const placeData = req.body;
        const newPlace = new Place(placeData);
        await newPlace.save();
        res.status(201).json(newPlace);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 여행지 목록 조회
router.get('/', async (req, res) => {
    try {
        const places = await Place.find();
        res.status(200).json(places);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 여행지 상세 조회
router.get('/:id', async (req, res) => {
    try {
        const place = await Place.findById(req.params.id);
        if (!place) {
            return res.status(404).json({ message: 'Place not found' });
        }
        res.status(200).json(place);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
