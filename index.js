const { Client, Collection, Intents } = require('discord.js');
const mongoose = require('mongoose');
const ErrorLogging = require('./classes/ErrorLogging');

const client = new Client({
    partials: ['MESSAGE', 'REACTION'],
    intents: Intents.ALL,
});

//#region Init Commands and events

['commands', 'aliases'].forEach((x) => (client[x] = new Collection()));

['event', 'command'].forEach((handler) =>
    require(`./handlers/${handler}`)(client)
);

//#endregion

//#region Init Client variables
client.prefix = process.env.PREFIX;

client.ids = require('./json/Ids.json');

client.enableLogs = process.env.ENABLE_LOGS;

client.openedTickets = new Map();
//#endregion

//#region Init Logging
const logger = new ErrorLogging(client);

client.on('info', (m) => logger.info(m));
client.on('warn', (m) => logger.warn(m));
client.on('error', (m) => logger.error(m));

process.on('uncaughtException', (error) => logger.uncaughtException(error));
//#endregion

(async () => {
    //#region Init Database
    client.db = await mongoose.connect(process.env.DB_CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    });
    //#endregion

    await logger.init();

    client.guildId = process.env.GUILD_ID;

    return client.login(process.env.TOKEN);
})();
