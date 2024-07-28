const express = require('express');
const router = express.Router();
const placeController = require('../controllers/placeController');

// 여행지 라우트
router.post('/', placeController.createPlace);
router.put('/:placeId', placeController.updatePlace);
router.delete('/:placeId', placeController.deletePlace);
router.get('/', placeController.searchPlaces);
router.get('/list', placeController.listPlaces);
router.get('/:placeId', placeController.getPlaceDetails);
router.post('/:placeId/wish', placeController.addWish);
router.delete('/:placeId/wish', placeController.removeWish);
router.get('/:placeId/wishCount', placeController.getWishCount);
router.post('/:placeId/reviews', placeController.addReview);
router.put('/:placeId/reviews/:reviewId', placeController.updateReview);
router.delete('/:placeId/reviews/:reviewId', placeController.deleteReview);
router.get('/:placeId/reviews', placeController.listReviews);
router.get('/:placeId/reviews/:reviewId', placeController.getReviewDetails);

module.exports = router;