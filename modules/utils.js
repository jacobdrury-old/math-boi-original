const Webhook = require('../db/models/webhooks.js');
const Role = require('../db/models/roles.js');
const ReactionMessage = require('../db/models/reactionMessages.js');
const BlockList = require('../db/models/blockList.js');
const { WebhookClient } = require('discord.js');

exports.getMessageLogChannel = async () => {
    return await this.getLogChannel('MessageLogChannel');
};

exports.getUserLogChannel = async () => {
    return await this.getLogChannel('UserLogChannel');
};

exports.getJoinLeaveLogChannel = async () => {
    return await this.getLogChannel('JoinLeaveLogChannel');
};

exports.getModLogChannel = async () => {
    return await this.getLogChannel('ModLogChannel');
};

exports.getLogChannel = async (name) => {
    const logChannel = await Webhook.findOne({ name });

    if (logChannel) return new WebhookClient(logChannel.Id, logChannel.token);

    return null;
};

exports.getBotErrorChannel = async (channelId) => {
    const botErrorChannel = await Webhook.findOne({ channelId });

    if (botErrorChannel)
        return new WebhookClient(botErrorChannel.Id, botErrorChannel.token);

    return null;
};

exports.getRoles = async (client) => {
    const roles = await Role.find();

    const arrayToObject = (array) =>
        array.reduce((obj, item) => {
            obj[item.name] = item;
            return obj;
        }, {});

    return arrayToObject(roles);
};

exports.getReactionMessage = async (client, id) => {
    return (
        (await ReactionMessage.findOne({ messageId: id }).populate(
            'blockedUsers'
        )) || null
    );
};

exports.sleep = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
};

exports.isReactionRoleChannel = (client, messageReaction) => {
    return (
        messageReaction.message.channel.id === client.ids.channels.rules ||
        messageReaction.message.channel.id ===
            client.ids.channels.roleSelection ||
        messageReaction.message.channel.id ===
            client.ids.channels.tutorRoleSelection
    );
};

exports.getBlockedTutors = async () => {
    return await this.getBlockedRole('Blocked Tutors');
};

exports.getBlockedRole = async (role) => {
    const blockedRole = await BlockList.findOne({ _id: role });
    if (blockedRole) return blockedRole;

    const blockList = new BlockList({
        _id: role,
        blocked: [],
    });

    await blockList.save();

    return blockList;
};
