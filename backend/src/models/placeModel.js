const { Schema, model } = require('mongoose');

const placeSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    location: {
        type: {
            type: String, // e.g., 'Point'
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        },
    },
    rating: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

module.exports = model('Place', placeSchema);
