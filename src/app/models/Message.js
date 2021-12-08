const mongoose = require('mongoose');
const room = require('../models/Room');
const user = require('../models/User');

const Schema = mongoose.Schema;
const Message = new Schema({
    room: { type: Schema.Types.ObjectId, ref: 'Room',unique: true},
    content: [
        {
            time: {
                type: String,
            },
            title: { type: String },
            user: { type: Schema.Types.ObjectId, ref: 'User' },
        },
    ],
});

module.exports = mongoose.model('Message', Message);
