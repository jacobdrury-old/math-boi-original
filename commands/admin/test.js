const mongoose = require('mongoose');
const User = require('../../db/models/users');
module.exports = {
    name: 'test',
    adminOnly: true,
    guildOnly: true,
    category: 'admin',
    async execute(message) {
        const guildMembers = await message.guild.members.fetch();
        const members = guildMembers.filter((member) => !member.user.bot);

        for (let [id, member] of members) {
            const user = new User({
                _id: mongoose.Types.ObjectId(),
                guildId: member.guild.id,
                discordID: member.id,
                username: member.user.username,
                discriminator: member.user.discriminator,
                tag: member.tag,
                nickname: member.nickname,
            });

            user.save();
        }

        await message.channel.send('Done');
    },
};
