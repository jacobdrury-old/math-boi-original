const winston = require('winston');
const chalk = require('chalk');
const { getBotErrorChannel } = require('../modules/utils');

class ErrorLogging {
    constructor(client) {
        this.client = client;

        this.colors = {
            info: '#487eff',
            debug: '#00f763',
            warn: '#feac2f',
            error: '#f0131e',
            uncaughtException: '#f0131e',
        };

        this.botChannelLogId = client.ids.channels.botErrors;
        this.botLogRoleId = client.ids.roles.botLogs;
    }

    async init() {
        this.logger = winston.createLogger({
            transports: [new winston.transports.Console()],
            format: winston.format.printf(
                (log) => `[${log.level.toUpperCase()}] - ${log.message}`
            ),
        });

        this.BotErrorChannelWebhook = await getBotErrorChannel(
            this.botChannelLogId
        );
    }

    async info(m) {
        await this.log(chalk.blue('info'), m);
    }

    async warn(m) {
        await this.log(chalk.yellow('warning'), m);
    }

    async error(m) {
        await this.log(chalk.redBright('fatal error'), m);
    }

    async uncaughtException(error) {
        await this.log(chalk.redBright('fatal uncaught exception'), error);
    }

    async log(level, message) {
        this.logger.log(level, message);
        await this.BotErrorChannelWebhook.send(`<@&${this.botLogRoleId}>`, {
            embeds: [
                {
                    timestamp: new Date(),
                    color: this.colors[level],
                    title: `${level.toUpperCase()}`,
                    description: `${message}`,
                },
            ],
        });
    }
}
module.exports = ErrorLogging;
