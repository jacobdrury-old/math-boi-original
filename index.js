const { Client, Collection } = require('discord.js');
const mongoose = require('mongoose');

const client = new Client({
    partials: ['MESSAGE', 'REACTION'],
});

['commands', 'aliases'].forEach((x) => (client[x] = new Collection()));

['event', 'command'].forEach((handler) =>
    require(`./handlers/${handler}`)(client)
);

client.prefix = process.env.PREFIX;

client.ids = require('./json/Ids.json');

client.enableLogs = process.env.ENABLE_LOGS;

client.openedTickets = new Map();

(async () => {
    client.db = await mongoose.connect(process.env.DB_CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    client.guildId = process.env.GUILD_ID;

    return client.login(process.env.TOKEN);
})();
