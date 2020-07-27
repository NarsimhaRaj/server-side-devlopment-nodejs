const express = require('express');
const bodyParser = require('body-parser');

const router = express.Router();
router.use(bodyParser.json());

router.get('/', function (req, res, next) {
    res.end("Welcome to Express");
});

module.exports = router;