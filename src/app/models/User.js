const mongoose = require('mongoose');
const room = require('../models/Room');

const Schema = mongoose.Schema;
const User = new Schema({
    name: { type: String, require: true },
    firstName: { type: String },
    lastName: { type: String },
    username: { type: String, require: true },
    password: { type: String, maxlength: 1000 },
    img: { type: String },
    createdAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },
    rooms: [{ type: Schema.Types.ObjectId, ref: 'Room' }],
    isActive: { type: Schema.Types.Boolean, default: false },
});

module.exports = mongoose.model('User', User);
