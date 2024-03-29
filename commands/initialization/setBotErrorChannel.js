const Webhook = require('../../db/models/webhooks.js');
const mongoose = require('mongoose');
const { WebhookClient } = require('discord.js');
const { getBotErrorChannel } = require('../../modules/utils.js');
module.exports = {
    name: `setBotErrorChannel`,
    description: `Sets the channel for all bot errors to be sent`,
    args: true,
    usage: '<tag the channel>',
    guildOnly: true,
    ownerOnly: true,
    category: 'initialization',
    async execute(message, args) {
        try {
            const webhook = await createWebhook(message, args);

            const existingWebhook = await getBotErrorChannel();

            await (!existingWebhook
                ? createNewWebhook(webhook)
                : updateExistingWebhook(existingWebhook, webhook));

            await webhook.send(
                `Successfully ${
                    !existingWebhook ? 'initialized' : 'updated'
                } the Bot Error channel!`
            );
        } catch (ex) {
            message.client.logger.error(ex);
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
        name: `botErrorChannel`,
        channelId: webhook.channelID,
        Id: webhook.id,
        token: webhook.token,
    });

    return wbhook.save();
};
