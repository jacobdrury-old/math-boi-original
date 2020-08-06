const { Client, Collection } = require('discord.js');
const mongoose = require('mongoose');
require('events').EventEmitter.defaultMaxListeners = 100;

const client = new Client();
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

    return client.login(process.env.TOKEN);
})();
