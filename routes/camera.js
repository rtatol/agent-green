const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {

    res.render('camera', {
        'title': 'Camera',
        'camUrl': process.env.CAMERA_URL
    });
});

module.exports = router;
