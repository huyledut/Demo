const User = require('../models/User');
const bcrypt = require('bcrypt');
const Message = require('../models/Message');
const Room = require('../models/Room');
const {
    dbHelperToObject,
    dbHelperToListObject,
} = require('../../util/dbHelper');

const {
   toMembers
} = require('../../util/toMembers');
class MeController {
    //[GET] /me/stored/courses
    storedCourses(req, res, next) {
        Promise.all([Course.find({}), Course.countDocumentsDeleted()])
            .then(([courses, deletedCount]) =>
                res.render('../../resource/views/me/stored-course.hbs', {
                    deletedCount,
                    courses: dbHelperToListObject(courses),
                }),
            )
            .catch(next);
    }

    //[GET] /me/trash/courses
    trashCourses(req, res, next) {
        Course.findDeleted({})
            .then((courses) => {
                // courses = courses.map(course => course.toObject();
                res.render('../../resource/views/me/trash-course.hbs', {
                    courses: dbHelperToListObject(courses),
                });
            })
            .catch(next);
    }
    profile(req, res, next) {
        User.findOne({ _id: req.signedCookies.userID })
            .then((user) => {
                res.render('../../resource/views/me/profile', {
                    user: dbHelperToObject(user),
                });
            })
            .catch((e) => {
                res.render('../../resource/views/me/profile', {
                    err: err.message,
                });
            });
    }
    async profile_update(req, res, next) {
        const formData = req.body;
        var account = await User.findOne({ _id: req.signedCookies.userID });
        if (formData.password !== formData.password_rp) {
            res.render('../../resource/views/me/profile', {
                err: 'Mật khẩu lặp lại không khớp!',
                user: dbHelperToObject(account),
            });
        } else {
            const hash_password = await bcrypt.hash(formData.password, 10);
            const user = await User.updateOne(
                { _id: req.signedCookies.userID },
                { $set: { password: hash_password } },
            );
            if (user) {
                res.render('../../resource/views/me/profile', {
                    success: 'Cập nhật thành công!',
                    user: dbHelperToObject(account),
                });
            } else {
                res.render('../../resource/views/me/profile', {
                    err: 'Đã xảy ra lỗi!',
                    user: dbHelperToObject(account),
                });
            }
        }
    }

    profile_updateInformation(req, res, next) {
        User.updateOne({ _id: req.signedCookies.userID }, req.body)
            .then(() => res.redirect('back'))
            .catch((err) => {
                res.render('../../resource/views/me/profile', {
                    err: err.message,
                });
            });
    }

    index(req, res, next) {
        res.render('../../resource/views/home', {
            option: 'profile',
        });
    }

    setting(req, res, next) {
        res.render('../../resource/views/me/setting', {
            option: 'setting',
        });
    }

    join(req, res, next) {
        User.findOne({ _id: req.signedCookies.userID })
            .then((user) => {
                res.render('../../resource/views/me/join', {
                    user: dbHelperToObject(user),
                });
            })
            .catch((err) => {
                res.render('../../resource/views/me/join', {
                    err: err.message,
                });
            });
    }
    post_join(req, res, next) {
        Promise.all([
            User.findOne({ _id: req.signedCookies.userID }),
            Room.findOne({ _id: req.body.id_Room }),
        ])
            .then(([user, room]) => {
                user.rooms.push(req.body.id_Room);
                room.members.push(user._id);
                room.count= room.members.length;
                user.save();
                room.save();
                res.redirect('/me/rooms');
            })
            .catch((e) => {
                User.findOne({ _id: req.signedCookies.userID })
                    .then((user) => {
                        res.render('../../resource/views/me/join', {
                            user: dbHelperToObject(user),
                            err: 'Phòng họp này không tồn tại!',
                        });
                    })
                    .catch(next);
            });
    }
    rooms(req, res, next) {
        User.findById(req.signedCookies.userID)
            .populate('rooms')
            .then((user) => {
                res.render('../../resource/views/me/rooms', {
                    rooms: dbHelperToListObject(user.rooms),
                    user: dbHelperToObject(user),
                });
            })
            .catch(next);
    }
    detail(req, res, next) {
        res.locals.idRoom = req.params.slug;
        Promise.all([
            User.findOne({ _id: req.signedCookies.userID }),
            Room.findOne({ _id: req.params.slug }),
            Room.findById(req.params.slug).populate('members'),
            Room.findById(req.params.slug).populate('admin'),
            Message.findOne({room:req.params.slug}).populate('content.user'),
        ])
            .then(([user, room, roomDetail, roomAdmin,message]) => {
                // console.log('here:\n', dbHelperToListObject(roomAdmin.admin));
                res.render('../../resource/views/me/detail', {
                    idRoom: req.params.slug,
                    user: dbHelperToObject(user),
                    userID: req.signedCookies.userID,
                    room: dbHelperToObject(room),
                    admins: dbHelperToListObject(roomAdmin.admin),
                    members: toMembers(dbHelperToListObject(roomDetail.members),dbHelperToListObject(roomAdmin.admin)),                 
                    isAdmin: roomDetail.admin.includes(
                        req.signedCookies.userID,
                    ),
                    content: dbHelperToListObject(message.content),
                });
            })
            .catch(next);
    }
    create(req, res, next) {
        // res.render('../../resource/views/me/create', {
        //     option: 'create',
        // });
        User.findOne({ _id: req.signedCookies.userID })
            .then((user) => {
                res.render('../../resource/views/me/create', {
                    user: dbHelperToObject(user),
                });
            })
            .catch((err) => {
                res.render('../../resource/views/me/create', {
                    err: err.message,
                });
            });
    }

    create_post(req, res, next) {
        const room = new Room({
            ClassName: req.body.ClassName,
            img: 'https://ecorp.edu.vn/wp-content/uploads/T%E1%BB%AB-v%E1%BB%B1ng-ti%E1%BA%BFng-Anh-ch%E1%BB%A7-%C4%91%E1%BB%81-gi%C3%A1o-d%E1%BB%A5c-3-500x500.jpeg',
        });
        const message = new Message({room: room._id});
        User.findOne({ _id: req.signedCookies.userID })
            .then((user) => {
                user.rooms.push(room._id);
                room.members.push(user._id);
                room.admin.push(user._id);
                message.save();
                user.save();
                room.save();
                res.redirect('/me/rooms');
            })
            .catch((err) => {
                res.render('../../resource/views/me/create', {
                    err: err.message,
                });
            });
    }
    call(req, res, next) {
        Promise.all([
            User.findById(req.signedCookies.userID),
            Room.findById(req.params.slug).populate('Calling')])
        .then(([user,room]) => {
            res.render('../../resource/views/me/call', {
                idRoom: req.params.slug,
                user: dbHelperToObject(user),
                userID: req.signedCookies.userID,
                listCall: dbHelperToListObject(room.Calling),
                port : process.env.PORT || 3002
            });
        })
            .catch(next);
    }

    //[DELETE] me/rooms/:id
    async outRoom(req, res, next) {
        var user =await User.updateOne(
            { _id: req.signedCookies.userID },
            { $pullAll: { rooms: [req.params.slug] } },
        );
        var room =  await  Room.findOne(
            { _id: req.params.slug }
        );
        if(room.admin.includes(req.signedCookies.userID)){
            console.log("id"+req.signedCookies.userID)
            await Room.updateOne(
                { _id: req.params.slug },
                { $pullAll: { admin: [req.signedCookies.userID] } },
            );
        }
        await Room.updateOne(
            { _id: req.params.slug },
            { $pullAll: { members: [req.signedCookies.userID] } },
        );
        room.count= room.members.length;
        await room.save();
        res.redirect('/me/rooms');
    }

    //[PUT] me/rooms/:id
    updateRoom(req, res, next) {
        Promise.all([
            Room.updateOne(
                { _id: req.params.slug },
                { ClassName: req.body.ClassName },
            ),
            User.findById(req.signedCookies.userID).populate('rooms'),
        ])
            .then(([room, user]) => {
                res.redirect('back');
            })
            .catch((err) => {
                console.log(err);
            });
    }

    async setAdmin(req, res,next) {
        var room =await Room.findOne({_id: req.query.idRoom});
        if(room){
            room.admin.push(req.query.idUser);
            await room.save();
        }
        else{
            console.log("Lỗi không tìm được room");
        }
        res.redirect('back');
    }

    async outAdmin(req, res,next) {
        try {
            var room =  await  Room.findOne(
                { _id: req.query.idRoom }
            );
            if(room.admin.includes(req.query.idUser)){
                await Room.updateOne(
                    { _id: req.query.idRoom },
                    { $pullAll: { admin: [req.query.idUser] } },
                );
            }
            res.redirect('back');
        } catch (error) {
            console.log(error);
        }
    }

    async delete_member(req, res, next){
        var user =await User.updateOne(
            { _id: req.query.idUser},
            { $pullAll: { rooms: [req.query.idRoom] } },
        );
        var ROOM = await Room.updateOne(
            { _id: req.query.idRoom},
            { $pullAll: { members: [req.query.idUser] } },
        );
        var room = await Room.findOne({_id: req.query.idRoom});
        room.count= room.members.length;
        await room.save();
        res.redirect('back');
    }
}
module.exports = new MeController();
