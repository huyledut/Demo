const express = require('express');
const router = express.Router();

// khai bao doi tuong nhan lai export cua newsController
const meController = require('../app/controllers/MeController');
const auth_middleware = require('../app/middleware/Auth_middleware');


router.get('/join', meController.join);
router.post(
    '/join',
    auth_middleware.checkDuplecateMember,
    meController.post_join,
);
router.get('/rooms', meController.rooms);
router.get('/rooms/:slug',auth_middleware.requireRoom ,meController.detail);
router.get('/rooms/call/:slug',auth_middleware.requireRoom,auth_middleware.requireCall ,meController.call);
router.delete('/rooms/deleteMember',meController.delete_member);
router.patch('/rooms/setAdmin', meController.setAdmin);
router.delete('/rooms/outAdmin', meController.outAdmin);
router.delete('/rooms/:slug', meController.outRoom);
router.put('/rooms/:slug', meController.updateRoom);
router.get('/create', meController.create);
router.post('/rooms/create', meController.create_post);
router.post('/profile', meController.profile_update);
router.put('/profile', meController.profile_updateInformation);
router.get('/profile', meController.profile);
router.get('/', meController.index);
//export ra ngoai
module.exports = router;
