const { Client, Collection } = require('discord.js');
const { getLogChannel } = require('./modules/utils.js');
const mongoose = require('mongoose');

const client = new Client({
    partials: ['MESSAGE', 'REACTION'],
});

['commands', 'aliases'].forEach((x) => (client[x] = new Collection()));

['event', 'command'].forEach((handler) =>
    require(`./handlers/${handler}`)(client)
);
client.prefix = process.env.PREFIX;
client.guildId = process.env.GUILD_ID;

(async () => {
    client.db = await mongoose.connect(process.env.DB_CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const logChannel = await getLogChannel();
    if (logChannel) client.logChannelId = logChannel.channelId;
    return client.login(process.env.TOKEN);
})();
