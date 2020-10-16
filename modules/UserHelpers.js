const { WebhookClient } = require('discord.js');
const { logEmbed, setToRoleEmbedForUser } = require('./embeds.js');
const { getUserLogChannel } = require('../modules/utils.js');
const minAge = 13;

exports.getIsOwner = (member) => member.guild.ownerID == member.id;

exports.getIsAdmin = (client, member) =>
    member.hasPermission('ADMINISTRATOR') ||
    member.roles.cache.get(client.ids.roles.headMod);

exports.getIsModerator = (client, member) =>
    member.roles.cache.get(client.ids.roles.moderator);

exports.getIsBooster = (client, member) =>
    member.roles.cache.get(client.ids.roles.booster);

exports.getIsTrainee = (client, member) =>
    member.roles.cache.get(client.ids.roles.traineeMod);

exports.setToRole = async (member, role, adminId = null, shouldLog = true) => {
    await member.roles.add(role);

    if (shouldLog) {
        await member.send({ embed: await setToRoleEmbedForUser(member, role) });

        const webhookClient = await getUserLogChannel();
        if (webhookClient) {
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

        const webhookClient = await getUserLogChannel();
        if (webhookClient) {
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

exports.isUserTooYoung = async (member) => {
    try {
        const memberDM = await member.createDM();
        memberDM.send(
            'Before I am able to give you the middle school role, I have to verify your age! How old are you?'
        );
        return await handleConvo(member, memberDM);
    } catch (err) {
        return await userDMsClosed(member);
    }
};

const handleConvo = async (member, channel) => {
    try {
        const filter = (m) => m.author.id === member.id;

        const messages = await channel.awaitMessages(filter, {
            max: 1,
            time: 600000,
            errors: ['time'],
        });

        const age = messages.first().content.replace(/\D/g, '');

        const isTooYoung = age < minAge;

        if (isTooYoung) {
            await channel.send(
                'Unfortunately you are not old enough to participate in this server, you will be temporality banned from this server'
            );

            await member.ban({ days: 14, reason: `User is ${age} years old` });
        } else {
            await channel.send(
                'Thank you for verifying your age! I have added the middle school role to you!'
            );
        }

        return isTooYoung;
    } catch (err) {
        await channel.send(
            'This request has timed out, please try again later.'
        );
        return true;
    }
};

const userDMsClosed = async (member) => {
    const channel = await member.guild.channels.create(
        `Age Verification ${member.user.discriminator}`,
        {
            type: 'text',
            permissionOverwrites: [
                { id: member.guild.id, deny: ['VIEW_CHANNEL'] },
                {
                    id: member.id,
                    allow: [
                        'VIEW_CHANNEL',
                        'SEND_MESSAGES',
                        'READ_MESSAGE_HISTORY',
                    ],
                },
                {
                    type: 'role',
                    id: '737374602719920191',
                    allow: [
                        'VIEW_CHANNEL',
                        'SEND_MESSAGES',
                        'READ_MESSAGE_HISTORY',
                    ],
                },
            ],
        }
    );

    await channel.send(
        `${member} Before I am able to give you the middle school role, I have to verify your age! How old are you?`
    );

    const isTooYoung = await handleConvo(member, channel);

    await sleep(30000);
    await channel.delete();
    return isTooYoung;
};

const sleep = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
};
