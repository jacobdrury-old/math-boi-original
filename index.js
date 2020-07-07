const { Client, Collection } = require('discord.js');
require('events').EventEmitter.defaultMaxListeners = 20;

const client = new Client();
['commands', 'aliases'].forEach((x) => (client[x] = new Collection()));

['event', 'command'].forEach((handler) =>
    require(`./handlers/${handler}`)(client)
);
client.prefix = process.env.PREFIX;
client.guildId = process.env.GUILD_ID;
client.mongoose = require('./db/mongoose');

client.login(process.env.TOKEN);
