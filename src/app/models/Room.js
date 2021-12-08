const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const user = require('../models/User');

const Schema = mongoose.Schema;

const Room = new Schema({
    ClassName: { type: String, require: true },
    CreateBy: { type: String },
    img: { type: String },
    createdAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    admin: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    count: {type:Number, default:1},
    Calling: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

module.exports = mongoose.model('Room', Room);
