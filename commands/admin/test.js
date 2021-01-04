const User = require('../../db/models/users');
const { setToRole, removeRole } = require('../../modules/UserHelpers');
const mongoose = require('mongoose');
const topTutor = require('../basic/topTutor').execute;

module.exports = {
    name: 'test',
    adminOnly: true,
    guildOnly: true,
    category: 'admin',
    async execute(message) {
        const client = message.client;

        const topTutorRole = client.ids.roles.tutor.top;

        const tutor = (await topTutor(null, message.channel))[0];

        const guild = client.guilds.cache.get(client.guildId);

        const previousTopTutors = guild.roles.cache.get(topTutorRole).members;

        for (const [id, member] of previousTopTutors) {
            await removeRole(member, topTutorRole);
        }

        const member = await guild.members.fetch(tutor.discordID);

        await setToRole(member, client.ids.roles.tutor.top);
    },
};
