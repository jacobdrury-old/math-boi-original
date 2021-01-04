const AgeVerification = require('../classes/AgeVerification');
const User = require('../db/models/users');
const {
    logEmbed,
    setToRoleEmbedForUser,
    removeRoleEmbedForUser,
} = require('./embeds.js');
const { getUserLogChannel } = require('../modules/utils.js');
const { sleep } = require('./utils');

exports.getIsOwner = (member) => member.guild.ownerID == member.id;

exports.getIsAdmin = (client, member) => member.hasPermission('ADMINISTRATOR');

exports.getIsHeadMod = (client, member) =>
    member.roles.cache.get(client.ids.roles.headMod) ? true : false;

exports.getIsModerator = (client, member) =>
    member.roles.cache.get(client.ids.roles.moderator) ? true : false;

exports.getIsBooster = (client, member) =>
    member.roles.cache.get(client.ids.roles.booster) ? true : false;

exports.getIsTrainee = (client, member) =>
    member.roles.cache.get(client.ids.roles.traineeMod) ? true : false;

exports.getIsVerified = (client, member) =>
    member.roles.cache.get(client.ids.roles.verified) ? true : false;

exports.getIsTutor = (client, member) =>
    member.roles.cache.get(client.ids.roles.tutor.id) ? true : false;

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
        memberDM.send('', {
            embed: {
                color: 0x00f763,
                title: 'Age Verification',
                description:
                    'Before I am able to give you the middle school role, I have to verify your age! How old are you?',
            },
        });

        return await handleConvo(member, memberDM);
    } catch (err) {
        return await userDMsClosed(member);
    }
};

const handleConvo = async (member, channel) => {
    const ticket = new AgeVerification(member.client, member);
    return await ticket.handleConvo(channel);
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
                    id: member.client.ids.roles.staff,
                    allow: [
                        'VIEW_CHANNEL',
                        'SEND_MESSAGES',
                        'READ_MESSAGE_HISTORY',
                    ],
                },
            ],
        }
    );

    await channel.send(member, {
        embed: {
            color: 0x00f763,
            title: 'Age Verification',
            description:
                'Before I am able to give you the middle school role, I have to verify your age! How old are you?',
        },
    });

    const isTooYoung = await handleConvo(member, channel);

    await sleep(30000);
    await channel.delete();
    return isTooYoung;
};
