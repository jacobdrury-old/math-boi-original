const { checkUserAge } = require('../../modules/UserHelpers.js');

module.exports = {
    name: 'test',
    description: 'test',
    adminOnly: true,
    guildOnly: true,
    category: 'admin',
    async execute(message, args) {
        const id = args[0];
        const member = await message.guild.members.fetch(id);
        const response = await checkUserAge(member);
        console.log(`Response: ${response}`);
    },
};
