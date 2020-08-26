const { WebhookClient } = require('discord.js');
const { logEmbed, setToRoleEmbedForUser } = require('./embeds.js');
const { getLogChannel } = require('../modules/utils.js');

exports.setToRole = async (member, role, adminId = null, shouldLog = true) => {
    await member.roles.add(role);

    if (shouldLog) {
        await member.send({ embed: await setToRoleEmbedForUser(member, role) });

        const logChannel = await getLogChannel(member.client);
        if (logChannel) {
            const webhookClient = new WebhookClient(
                logChannel.Id,
                logChannel.token
            );
            const embed = logEmbed(member, 'Role Added').addFields(
                {
                    name: 'User',
                    value: `<@!${member.id}>`,
                    inline: true,
                },
                {
                    name: 'Role',
                    value: `<@&${role}>`,
                    inline: true,
                }
            );

            if (adminId) {
                embed.addField('Added By', `<@!${adminId}>`);
            }

            await webhookClient.send({ embeds: [embed] });
        }
    }

    return member.guild.roles.fetch(role);
};

exports.removeRole = async (member, role, adminId = null, shouldLog = true) => {
    await member.roles.remove(role);

    if (shouldLog) {
        await member.send({
            embed: await removeRoleEmbedForUser(member, role),
        });

        const logChannel = await getLogChannel(member.client);
        if (logChannel) {
            const webhookClient = new WebhookClient(
                logChannel.Id,
                logChannel.token
            );
            const embed = logEmbed(member, 'Role Removed').addFields(
                {
                    name: 'User',
                    value: `<@!${member.id}>`,
                    inline: true,
                },
                {
                    name: 'Role',
                    value: `<@&${role}>`,
                    inline: true,
                }
            );

            if (adminId) {
                embed.addField('Added By', `<@!${adminId}>`);
            }

            await webhookClient.send({ embeds: [embed] });
        }
    }
};

const minAge = 13;

exports.checkUserAge = async (member) => {
    const filter = (m) => m.author.id === member.id;
    const memberDM = await member.createDM();

    memberDM.send('How old are you?');

    const messages = await memberDM.awaitMessages(filter, {
        max: 1,
        time: 60000,
        errors: ['time'],
    });

    console.log(messages);
};
