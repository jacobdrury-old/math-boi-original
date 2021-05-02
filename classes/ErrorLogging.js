const { MessageEmbed } = require('discord.js');
const os = require('os');
const winston = require('winston');
const { getBotErrorChannel } = require('../modules/utils');

const { printf } = winston.format;

class Logger {
    constructor(client) {
        this.client = client;
        this.botChannelLogId = client.ids.channels.botErrors;
        this.botLogRoleId = client.ids.roles.botLogs;

        this.colors = {
            info: '#487eff',
            warn: '#feac2f',
            error: '#f0131e',
        };

        this.logger = winston.createLogger({
            transports: [
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        winston.format.metadata({
                            fillExcept: [
                                'timestamp',
                                'service',
                                'level',
                                'message',
                            ],
                        }),
                        winston.format.colorize(),
                        this.winstonConsoleFormat()
                    ),
                }),
            ],
        });
    }

    async init() {
        this.BotErrorChannelWebhook = await getBotErrorChannel(
            this.botChannelLogId
        );
    }

    winstonConsoleFormat() {
        return printf(({ timestamp, level, message, metadata }) => {
            const metadataString =
                metadata != null ? 'METADATA:' + JSON.stringify(metadata) : '';
            return `[${timestamp}][${level}] ${message} ${metadataString}`;
        });
    }
    // We expose four levels of logging for this tutorial

    debug(log, metadata) {
        this.log('debug', log, metadata);
    }

    info(log, metadata) {
        this.log('info', log, metadata);
    }

    warn(log, metadata) {
        this.log('warn', log, metadata);
    }

    error(log, metadata) {
        this.log('error', log, metadata);
    }

    async log(level, log, metadata, stackTrace) {
        const metadataObject = {};

        if (metadata) metadataObject.metadata = metadata;
        if (stackTrace) metadataObject.stackTrace = stackTrace;

        var embed = new MessageEmbed();
        embed
            .setColor(this.colors[level])
            .setTimestamp()
            .setTitle(level.toUpperCase());

        if (log instanceof Error) {
            embed.setDescription(log.message);
            embed.addField('Stack Trace', log.stack);

            await this.BotErrorChannelWebhook.send(`<@&${this.botLogRoleId}>`, {
                embeds: [embed.toJSON()],
            });

            return this.logger[level](log.message, {
                metadata: { stack: log.stack },
            });
        }

        var metadataString = JSON.stringify(metadataObject);

        this.logger[level](JSON.stringify(log), metadataString);

        embed.setDescription(JSON.stringify(log));

        if (metadataString != '{}') {
            embed.addField('Metadata', metadataString);
        }

        await this.BotErrorChannelWebhook.send(`<@&${this.botLogRoleId}>`, {
            embeds: [embed.toJSON()],
        });
    }

    logTrace(level, log, metadata) {
        const stackTrace = new Error().stack;
        this.log(level, log, metadata, stackTrace);
    }
}

module.exports = Logger;
