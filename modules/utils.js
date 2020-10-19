const Webhook = require('../db/models/webhooks.js');
const Role = require('../db/models/roles.js');
const ReactionMessage = require('../db/models/reactionMessages.js');
const { WebhookClient } = require('discord.js');

exports.getMessageLogChannel = async () => {
    return await this.getLogChannel('MessageLogChannel');
};

exports.getUserLogChannel = async () => {
    return await this.getLogChannel('UserLogChannel');
};

exports.getModLogChannel = async () => {
    return await this.getLogChannel('ModLogChannel');
};

exports.getLogChannel = async (name) => {
    const logChannel = await Webhook.findOne({ name });

    if (logChannel) return new WebhookClient(logChannel.Id, logChannel.token);

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
    return (await ReactionMessage.findOne({ messageId: id })) || null;
};

exports.sleep = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
};
