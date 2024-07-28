const express = require('express');
const app = express();
const placeRoutes = require('./routes/placeRoutes');
// 다른 라우트 가져오기

app.use('/places', placeRoutes);
// 다른 라우트도 유사하게 사용

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});