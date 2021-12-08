const { Mongoose } = require('mongoose');

module.exports = {
    toMembers: function (members, admins) {
        const idAdmins = Array.from(admins, function (admin, index, array) {
            return admin._id.toString();
        });
        const result = members.filter(function (member, index, array) {
            return !idAdmins.includes(member._id.toString());
        });
        return result;
    }
};
