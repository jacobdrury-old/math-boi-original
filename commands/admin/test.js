const { getIsAdmin, getIsModerator } = require('../../modules/UserHelpers');
module.exports = {
    name: 'test',
    adminOnly: true,
    guildOnly: true,
    category: 'admin',
    async execute(message) {
        console.log(message.client.IGNORED);
    },
};
