
const {
    dbHelperToObject,
    dbHelperToListObject,
} = require('../../util/dbHelper');
class MeetController {
    join(req, res) {
        res.render('../../resource/views/meet/join.hbs');
    }
    create(req, res) {
        res.render('../../resource/views/meet/create.hbs');
    }
    show(req, res, next) {
        req.signedCookies.userID;
        res.render('../../resource/views/meet/create.hbs');
    }
}
module.exports = new MeetController();
