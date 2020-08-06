const Role = require('../db/models/roles.js');
const mongoose = require('mongoose');

exports.addRoleToDb = (client, roleId, roleName, cb) => {
    const role = new Role({
        _id: mongoose.Types.ObjectId(),
        name: roleName,
        Id: roleId,
    });

    role.save()
        .then(() => cb && cb(null))
        .catch((error) => cb && cb(error));
};
