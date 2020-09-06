const { description } = require('../commands/admin/clean');

const mailCategory = '751999833597804624';
const archiveCategory = '752000303787933706';
const staffID = '737374602719920191';
const emojis = ['❌', '✅'];

class Ticket {
    channel;
    dmChannel;
    msg;
    isActive = false;
    constructor(client, message, guild) {
        this.client = client;
        this.message = message;
        this.user = message.author;
        this.dmChannel = message.channel;
        this.guild = guild;
    }

    async init() {
        this.channel = await this.guild.channels.create(
            `${this.user.username}-${this.user.discriminator}`,
            {
                type: 'text',
                parent: mailCategory,
            }
        );
        return this.channel;
    }

    async isTicketAccepted() {
        this.msg = await this.channel.send('', {
            embed: {
                color: 0x00f763,
                title: 'New ModMail Message',
                author: {
                    name: this.user.tag,
                    icon_url: this.user.displayAvatarURL(),
                },
                description: this.message.content,
            },
        });

        emojis.forEach(async (emoji) => await this.msg.react(emoji));

        let isAccepted = false;
        try {
            const reactionFilter = (reaction, user) =>
                emojis.includes(reaction.emoji.name) && !user.bot;

            const reactions = await this.msg.awaitReactions(reactionFilter, {
                max: 1,
                time: 10000,
                errors: ['time'],
            });

            const choice = reactions.first()._emoji.name;

            if (choice == '✅') isAccepted = true;
            else await this.reject();
        } catch (err) {
            console.error(err);
            isAccepted = null;
            await this.timeout();
        }

        return isAccepted;
    }

    async reject() {
        await this.channel.delete();
        await this.dmChannel.send(
            'Your message was rejected. You may try again later'
        );
    }

    async timeout() {
        this.dmChannel.send('', {
            embed: {
                color: 0xff2c02,
                title:
                    'No one was able to accept your request. Please try again',
            },
        });

        let newEmbed = this.msg.embeds[0];
        newEmbed.color = 0xff2c02;
        newEmbed.title = 'ModMail Msg Timed out';

        await this.msg.edit('', { embed: newEmbed });
        await this.close();
    }

    handleConvo() {
        this.isActive = true;
        const dmFilter = (m) => m.author.id === this.user.id;
        const dmCollector = this.dmChannel.createMessageCollector(dmFilter);

        const cFilter = (m) =>
            m.channel.id === this.channel.id && !m.author.bot;
        const cCollector = this.channel.createMessageCollector(cFilter);

        return new Promise((resolve, reject) => {
            dmCollector.on('collect', async (m) => {
                const files = getAttachmentLinks(m.attachments);
                console.log(m.attachments);
                console.log(files);
                await this.channel.send('', {
                    embed: {
                        author: {
                            name: this.user.tag,
                            icon_url: this.user.displayAvatarURL(),
                        },
                        description: m.content,
                    },
                    files,
                });
            });

            cCollector.on('collect', async (m) => {
                if (m.content.toLowerCase() === '--stop') {
                    dmCollector.stop();
                    cCollector.stop();
                    this.close();
                    return resolve();
                }

                const files = getAttachmentLinks(m.attachments);

                await this.dmChannel.send('', {
                    embed: {
                        author: {
                            name: m.author.tag,
                            icon_url: m.author.displayAvatarURL(),
                        },
                        description: m.content,
                    },
                    files,
                });
            });
        });
    }

    async close() {
        this.isActive = false;
        await this.msg.reactions.removeAll();
        await this.channel.send('', {
            embed: {
                title: '🔒Archived🔒',
                description: 'This ticket has been closed and archived!',
            },
        });
        await this.channel.setParent(archiveCategory);

        await this.channel.updateOverwrite(staffID, {
            SEND_MESSAGES: false,
            MANAGE_MESSAGES: false,
            EMBED_LINKS: false,
            ATTACH_FILES: false,
        });
    }
}

const getAttachmentLinks = (attachments) => {
    const valid = /^.*(gif|png|jpg|jpeg)&/g;
    return attachments.array().map((attachment) => attachment.url);
};

module.exports = Ticket;
