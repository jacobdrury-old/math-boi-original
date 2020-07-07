const mongoose = require('mongoose');

const rolesSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    Id: String,
});

module.exports = mongoose.model('Role', rolesSchema);
