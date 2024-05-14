require('dotenv').config()

const { Client, Collection, Intents } = require('discord.js');
const mongoose = require('mongoose');
const Logger = require('./classes/ErrorLogging');

const client = new Client({
    partials: ['MESSAGE', 'REACTION'],
    intents: Intents.ALL,
});

//#region Init Commands and events

['commands', 'aliases'].forEach((x) => (client[x] = new Collection()));

['event', 'command'].forEach((handler) => require(`./handlers/${handler}`)(client));

//#endregion

console.log("prefix: " + process.env.PREFIX)
//#region Init Client variables
client.prefix = process.env.PREFIX;

client.ids = require('./json/Ids.json');

client.enableLogs = process.env.ENABLE_LOGS;

client.openedTickets = new Map();
//#endregion

//#region Init Logging
client.logger = new Logger(client);

client.on('info', (m) => client.logger.info(m));
client.on('warn', (m) => client.logger.warn(m));
client.on('error', (m) => client.logger.error(m));

process.on('uncaughtException', (error) => client.logger.error(error));
//#endregion

(async () => {
    //#region Init Database
    client.db = await mongoose.connect(process.env.DB_CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    });
    //#endregion

    await client.logger.init();

    client.guildId = process.env.GUILD_ID;
    client.StaffServerId = process.env.STAFF_SERVER_ID;

    return client.login(process.env.DISCORD_TOKEN);
})();
