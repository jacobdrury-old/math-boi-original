const User = require('../../db/models/users');
const clearTutorStats = require('./clearTutorStats');
module.exports = {
    name: 'test',
    adminOnly: true,
    guildOnly: true,
    category: 'admin',
    async execute(message) {
        clearTutorStats.execute(message.client);
    },
};
