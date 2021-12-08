const User = require('../models/User');
const Room = require('../models/Room');
const {
    dbHelperToObject,
    dbHelperToListObject,
} = require('../../util/dbHelper');
class CallController {
    async pushCall(idRoom, idUser) {
        try {
            const room = await Room.findOne({
                _id: idRoom,
            });
            if (!room) {
                console('Không tìm thấy phòng này!');
                next();
            }   
            if(!room.Calling.includes(idUser)){
                room.Calling.push(idUser)
            }
            await room.save();
        } catch (err) {
            console.log(err);
        }
    }

    async popCall(idRoom, idUser) {
        try {
            var ROOM = await Room.updateOne(
                { _id: idRoom},
                { $pullAll: { Calling: [idUser] } },
            );
        } catch (err) {
            console.log(err);
        }
    }
}
module.exports = new CallController();
