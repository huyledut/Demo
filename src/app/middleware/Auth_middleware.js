const User = require('../models/User');
const Room = require('../models/Room');
const {
    dbHelperToObject,
    dbHelperToListObject,
} = require('../../util/dbHelper');

module.exports.requireLogin = function (req, res, next) {
    if (!req.signedCookies) {
        res.locals.login = false;
        res.render('../../resource/views/auth/login.hbs');
        return;
    }

    User.findOne({ _id: req.signedCookies.userID }, function (err, user) {
        if (user) {
            User.updateOne(
                { _id: req.signedCookies.userID },
                { $set: { isActive: true } },
            ).then((user) => {
                res.locals.login = true;
                next();
            });
        } else {
            res.locals.login = false;
            res.render('../../resource/views/auth/login.hbs');
        }
    });
};

module.exports.requireHome = function (req, res, next) {
    if (!req.signedCookies) {
        res.locals.login = false;
        next();
        return;
    }
    User.findOne({ _id: req.signedCookies.userID }, function (err, user) {
        if (user) {
            // lấy thằng user
            res.locals.login = true;
            next();
        } else {
            res.locals.login = false;
            next();
        }
    });
};

module.exports.requireRoom = function (req, res, next) {
    Room.findOne({ members: req.signedCookies.userID,_id: req.params.slug}, function (err, room) {
        if (room ){
            next();
        } else 
        {
            User.findById(req.signedCookies.userID).then((user) => {
                res.render('../../resource/views/page404.hbs',  {
                user: dbHelperToObject(user),
                })})
       
        }});
};
module.exports.requireCall = function (req, res, next) {
    Room.findOne({ Calling: req.signedCookies.userID,_id: req.params.slug}, function (err, room) {
        if (!room ){
            next();
        } else {
            User.findById(req.signedCookies.userID).then((user) => {
                res.render('../../resource/views/pageExist.hbs',  {
                user: dbHelperToObject(user),
                })})
        }
    });
};

module.exports.checkDuplecateMember = function (req, res, next) {
    User.findOne({ _id: req.signedCookies.userID }, function (err, user) {
        if (user) {
            if (
                user.rooms.every(function (id) {
                    return id != req.body.id_Room;
                })
            )
                next();
            else {
                res.render('../../resource/views/me/join', {
                    user: dbHelperToObject(user),
                    err: 'Bạn đã tham gia phòng họp này!',
                });
            }
        } else {
            res.render('../../resource/views/me/join', {
                err: 'Lỗi kết nối!',
            });
        }
    });
};
