const User = require('../models/User');
const {
    dbHelperToObject,
    dbHelperToListObject,
} = require('../../util/dbHelper');
class HomeController {
    index(req, res) {
        User.findOne({ _id: req.signedCookies.userID })
            .then((user)=>{
                res.render('../../resource/views/home', {
                    user: dbHelperToObject(user),
                });
            })
            .catch((err)=>{console.log(err.message)});
    }
}
module.exports = new HomeController();
