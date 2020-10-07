module.exports = async (client, oldMember, newMember) => {
    const hadRole = oldMember.roles.cache.get(client.roleIds.boosterId);

    const hasRole = newMember.roles.cache.get(client.roleIds.boosterId);

    if (!hadRole && hasRole) {
        newMember.guild.channels.cache
            .get(client.channelIds.announcementID)
            .send(`Thank you for boosting the server ${newMember}!!`);
    }
};
