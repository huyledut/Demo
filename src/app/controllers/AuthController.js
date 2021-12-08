const User = require('../models/User');
const bcrypt = require('bcrypt');

const {
    dbHelperToObject,
    dbHelperToListObject,
} = require('../../util/dbHelper');
class AuthController {
    login(req, res, next) {
        res.render('../../resource/views/auth/login.hbs');
        next();
    }

    async logout(req, res) {
        res.clearCookie('userID');
        var user = await User.findOne({ _id: req.signedCookies.userID });
        await User.updateOne(
            { _id: req.signedCookies.userID },
            { $set: { isActive: false } },
        );
        res.render('../../resource/views/auth/login.hbs');
        res.cookie('isLogin', false, {
            signed: true,
        });
        res.clearCookie('_user');
    }

    register(req, res) {
        res.render('../../resource/views/auth/register.hbs');
    }

    async register_post(req, res, next) {
        try {
            const formData = req.body;
            if (formData.password !== formData.password_rp) {
                res.render('../../resource/views/auth/register', {
                    err: 'Mật khẩu lặp lại không khớp!',
                });
            } else {
                const account = await User.findOne({
                    username: formData.username,
                });
                const hash_password = await bcrypt.hash(formData.password, 10);
                if (!account) {
                    const user = new User({
                        username: formData.username,
                        password: hash_password,
                        img: 'https://secure.gravatar.com/avatar/6b72f6d6f4e46d77b82732ec182d248f/?s=48&d=https://images.binaryfortress.com/General/UnknownUser1024.png',
                    });
                    await user.save();
                    res.redirect('/auth/login');
                } else {
                    res.render('../../resource/views/auth/register', {
                        err: 'Tên đăng nhập đã được sử dụng!',
                    });
                }
            }
        } catch (err) {
            console.log(err);
            res.render('../../resource/views/auth/register', {
                err: 'Đã xảy ra lỗi hệ thống!',
            });
        }
    }

    async checkLogin(req, res, next) {
        const user = await User.findOne({ username: req.body.username });

        if (!user) {
            res.render('../../resource/views/auth/login', {
                err: 'Tên đăng nhập không tồn tại!',
                paraUser: req.body,
            });
        }
        else {
            const isPasswordCorrect = await bcrypt.compare(
                req.body.password,
                user.password,
            );
            if (!isPasswordCorrect) {
                res.render('../../resource/views/auth/login', {
                    err: 'Mật khẩu chưa đúng!',
                    paraUser: req.body,
                });
            } else {
                res.cookie('userID', user.id, {
                    signed: true,
                });
                res.locals.login = true;
                res.redirect('/');
            }
        }
    }
}
module.exports = new AuthController();
