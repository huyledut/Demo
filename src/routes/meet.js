const express = require('express');
const router = express.Router();
const meetController = require('../app/controllers/MeetController');
router.get('/join', meetController.join);
router.get('/create', meetController.create);
router.get('/', meetController.show);
module.exports = router;
