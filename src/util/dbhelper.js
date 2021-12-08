const { Mongoose } = require('mongoose');

module.exports = {
    dbHelperToListObject: function (mongooses) {
        return mongooses.map((mongoose) => mongoose.toObject());
    },
    dbHelperToObject: function (mongoose) {
        return mongoose ? mongoose.toObject() : mongoose;
    },
};
