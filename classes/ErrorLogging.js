const winston = require('winston');
const chalk = require('chalk');
const { getBotErrorChannel } = require('../modules/utils');

class ErrorLogging {
    constructor(client) {
        this.client = client;

        this.colors = {
            info: '#487eff',
            warn: '#feac2f',
            error: '#f0131e',
        };

        this.botChannelLogId = client.ids.channels.botErrors;
        this.botLogRoleId = client.ids.roles.botLogs;
    }

    async init() {
        this.logger = winston.createLogger({
            transports: [new winston.transports.Console()],
            format: winston.format.printf((log) => {
                var level = log.level.toUpperCase();
                switch (log.level) {
                    case 'info':
                        level = chalk.blue(level);
                        break;
                    case 'warn':
                        level = chalk.yellow(level);
                        break;
                    case 'error':
                        level = chalk.redBright(level);
                        break;
                    default:
                        break;
                }

                return `[${level}] - ${log.message}`;
            }),
        });

        this.BotErrorChannelWebhook = await getBotErrorChannel(
            this.botChannelLogId
        );
    }

    async info(m) {
        await this.log('info', m);
    }

    async warn(m) {
        await this.log('warn', m);
    }

    async error(m) {
        await this.log('error', m);
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
