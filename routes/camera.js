var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {

    res.render('camera', {
        'title': 'Camera',
        'camUrl': process.env.CAMERA_URL
    });
});

module.exports = router;
