const Ticket = require('../classes/Ticket');
const { sleep } = require('../modules/utils');

const {
    getIsOwner,
    getIsAdmin,
    getIsHeadMod,
} = require('../modules/UserHelpers');

const emojis = ['❌', '✅'];
class ModMail extends Ticket {
    constructor(client, message, guild) {
        super();
        this.client = client;
        this.message = message;
        this.user = message.author;
        this.dmChannel = message.channel;
        this.guild = guild;
        this.mailCategory = client.ids.categories.modMail;
        this.archiveCategory = client.ids.categories.archivedModMail;
        this.staffID = client.ids.roles.staff;
        this.headModID = client.ids.roles.headMod;
        this.channel;
        this.msg;
        this.dmCollector;
        this.cCollector;
    }

    async init() {
        this.channel = await this.guild.channels.create(
            `${this.user.username}-${this.user.discriminator}`,
            {
                type: 'text',
                parent: this.mailCategory,
                topic: 'Type -close to end the chat and archive it',
            }
        );

        return this.channel;
    }

    async isTicketAccepted() {
        this.msg = await this.channel.send(`<@&${this.staffID}>`, {
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
                time: 2.16e7,
                errors: ['time'],
            });

            const choice = reactions.first()._emoji.name;

            if (choice == '✅') {
                await this.accept();
                isAccepted = true;
            } else {
                await this.reject();
            }
        } catch (err) {
            console.error(err);
            isAccepted = null;
            await this.timeout();
        }

        return isAccepted;
    }

    async accept() {
        let newEmbed = this.msg.embeds[0];
        newEmbed.color = 0xb14cf3;
        newEmbed.title = 'Ticket Active';
        newEmbed.fields = [{ name: 'Message', value: newEmbed.description }];
        newEmbed.description =
            'This ticket is now open!\nYou may close this ticket at anytime by typing -close';

        await this.msg.edit('', { embed: newEmbed });
    }

    async reject() {
        await this.channel.delete();

        await this.dmChannel.send('', {
            embed: {
                color: 0xff2c02,
                title: 'Ticket Rejected',
                description:
                    'Your message was rejected. You may try again later',
            },
        });
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
        newEmbed.description = '';

        await this.msg.edit('', { embed: newEmbed });
        await this.close(false);
    }

    handleConvo() {
        this.isActive = true;
        const dmFilter = (m) => m.author.id === this.user.id;
        this.dmCollector = this.dmChannel.createMessageCollector(dmFilter);

        const cFilter = (m) =>
            m.channel.id === this.channel.id && !m.author.bot;
        this.cCollector = this.channel.createMessageCollector(cFilter);

        return new Promise((resolve, reject) => {
            this.dmCollector.on('collect', async (m) => {
                await this.channel.send('', {
                    embed: {
                        color: 0xff5e5e,
                        author: {
                            name: this.user.tag,
                            icon_url: this.user.displayAvatarURL({
                                dynamic: true,
                            }),
                        },
                        description: m.content,
                        timestamp: new Date(),
                        footer: { text: `ID: ${this.user.id}` },
                    },
                });

                const files = getAttachmentLinks(m.attachments);

                if (files.length) {
                    await this.channel.send('', { files });
                }
            });

            this.cCollector.on('collect', async (m) => {
                if (m.content.toLowerCase() === '-close') {
                    this.close();
                    return resolve(true);
                }

                await m.delete();

                const embed = {
                    embed: {
                        color: 0x2caefe,
                        author: {
                            name: m.author.tag,
                            icon_url: m.author.displayAvatarURL({
                                dynamic: true,
                            }),
                        },
                        description: m.content,
                        timestamp: new Date(),
                        footer: {
                            text: `${getRank(m.member)}`,
                        },
                    },
                };

                await this.channel.send('', embed);

                await this.dmChannel.send('', embed);

                const files = getAttachmentLinks(m.attachments);

                if (files.length) {
                    await this.dmChannel.send('', { files });
                }
            });
        });
    }

    async close(notifyUser = true) {
        this.isActive = false;
        this.dmCollector.stop();
        this.cCollector.stop();
        await this.msg.reactions.removeAll();
        await this.channel.send('', {
            embed: {
                title: '🔒Archived🔒',
                description: 'This ticket has been closed and archived!',
                timestamp: new Date(),
            },
        });

        await this.channel.setParent(this.archiveCategory);

        await sleep(500);

        await this.channel.lockPermissions();

        if (notifyUser)
            await this.dmChannel.send('', {
                embed: {
                    color: 0xf0131e,
                    title: 'Ticket Closed',
                    description:
                        'This ticket has been closed\nPlease reach out again if you need anything else!',
                    timestamp: new Date(),
                },
            });
    }
}

const getAttachmentLinks = (attachments) => {
    return attachments.array().map((attachment) => attachment.url);
};

const getRank = (member) => {
    if (getIsOwner(member)) return 'Owner';
    if (getIsAdmin(member.client, member)) return 'Admin';
    if (getIsHeadMod(member.client, member)) return 'Head Moderator';
};

module.exports = ModMail;
