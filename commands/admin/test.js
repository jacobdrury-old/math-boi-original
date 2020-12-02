const mongoose = require('mongoose');
const User = require('../../db/models/users');
const { getIsVerified, getIsTutor } = require('../../modules/UserHelpers');
module.exports = {
    name: 'test',
    adminOnly: true,
    guildOnly: true,
    category: 'admin',
    async execute(message) {
        const channels = message.guild.channels.cache.filter(
            (c) => c.type != 'category'
        );

        for (const [id, channel] of channels) {
            channel.updateOverwrite('739922768954392586', {
                MENTION_EVERYONE: true,
            });
        }

        console.log('Done');

        // const guildMembers = await message.guild.members.fetch();
        // const members = guildMembers.filter((member) => !member.user.bot);
        // for (let [id, member] of members) {
        //     const verified = getIsVerified(message.client, member);
        //     const isTutor = getIsTutor(message.client, member);
        //     const user = new User({
        //         _id: mongoose.Types.ObjectId(),
        //         guildId: member.guild.id,
        //         discordID: member.id,
        //         username: `${member.user.username}#${member.user.discriminator}`,
        //         verified,
        //         isTutor,
        //     });
        //     user.save();
        // }
        // await message.channel.send(
        //     'Successfully synced all users to the database'
        // );
    },
};
