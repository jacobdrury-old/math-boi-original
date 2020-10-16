const Webhook = require('../../db/models/webhooks.js');
const { getModLogChannel } = require('../../modules/utils');
const mongoose = require('mongoose');
const { WebhookClient } = require('discord.js');
const type = 'Mod';
module.exports = {
    name: `set${type}LogChannel`,
    description: `Sets the channel for all ${type} logs to be sent`,
    args: true,
    usage: '<tag the channel>',
    guildOnly: true,
    ownerOnly: true,
    category: 'initialization',
    async execute(message, args) {
        try {
            const webhook = await createWebhook(message, args);

            const existingWebhook = await getModLogChannel();

            await (!existingWebhook
                ? createNewWebhook(webhook)
                : updateExistingWebhook(existingWebhook, webhook));

            await webhook.send(
                `Successfully ${
                    !existingWebhook ? 'initialized' : 'updated'
                } the ${type} log channel!`
            );
        } catch (ex) {
            console.error(ex);
            await message.reply('Something went wrong :(\n' + ex.message);
        }
    },
};

const createWebhook = async (message, args) => {
    const rawChannelId = args[0];
    const channelId = rawChannelId.replace('<#', '').replace('>', '');
    const channel = message.guild.channels.cache.get(channelId);
    return channel.createWebhook(message.client.user.username, {
        avatar: message.client.user.displayAvatarURL(),
    });
};

const updateExistingWebhook = async (existingWebhook, webhook) => {
    const webhookClient = new WebhookClient(
        existingWebhook.Id,
        existingWebhook.token
    );
    if (webhookClient) await webhookClient.delete();

    existingWebhook.channelID = webhook.channelID;
    existingWebhook.Id = webhook.id;
    existingWebhook.token = webhook.token;
    return existingWebhook.save();
};

const createNewWebhook = async (webhook) => {
    const wbhook = new Webhook({
        _id: mongoose.Types.ObjectId(),
        name: `${type}LogChannel`,
        channelId: webhook.channelID,
        Id: webhook.id,
        token: webhook.token,
    });

    return wbhook.save();
};
