const { MessageEmbed } = require('discord.js');

exports.logEmbed = (member, action) => {
    return new MessageEmbed({
        color: 0x1e90ff,
        author: {
            name: `[${action}] ${member.user.username}#${member.user.discriminator}`,
            icon_url: `${member.user.displayAvatarURL()}`,
        },
    });
};

exports.newUserEmbed = (member) => {
    return new MessageEmbed({
        color: 0x800080,
        title: `Welcome to the ${member.guild.name} server!`,
        thumbnail: {
            url: member.guild.iconURL(),
        },
        // TODO: Insert custom welcome message here
        // description:,
    });
};

exports.setToRoleEmbedForUser = async (member, roleId) => {
    const role = await member.guild.roles.fetch(roleId);
    return new MessageEmbed({
        color: 0x00d166,
        title: `Role Added!`,
        description: `You have been added to the \`${role.name}\` role!`,
    });
};
