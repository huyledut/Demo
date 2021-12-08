const User = require('../models/User');
const Room = require('../models/Room');
const Message = require('../models/Message');
const {
    dbHelperToObject,
    dbHelperToListObject,
} = require('../../util/dbHelper');
class MessageController {
    async pushMessage(idRoom, data) {
        try {
            const message = await Message.findOne({
                room: idRoom,
            });
            if (!message) {
                console('Không tìm thấy phòng này!');
                next();
            }   
            message.content.push({
                title: data.message,
                user: data.id,
                time: data.time,
            })
            await message.save();
        } catch (err) {
            console.log(err);
        }
    }
}
module.exports = new MessageController();
