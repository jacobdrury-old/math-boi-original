module.exports = async (client, oldMember, newMember) => {
    const hadRole = oldMember.roles.cache.get(client.ids.roles.booster);

    const hasRole = newMember.roles.cache.get(client.ids.roles.booster);

    if (!hadRole && hasRole) {
        newMember.guild.channels.cache
            .get(client.ids.channels.announcement)
            .send(`Thank you for boosting the server ${newMember}!!`);
    }
};
