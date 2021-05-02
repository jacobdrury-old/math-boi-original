const { getModLogChannel } = require('../modules/utils');

const Ticket = require('../classes/Ticket');
const minAge = 13;
class AgeVerification extends Ticket {
    constructor(client, member) {
        super(true);
        this.client = client;
        this.member = member;

        this.client.openedTickets.set(this.member.id, this);
    }

    async handleConvo(channel) {
        this.channel = channel;

        try {
            const filter = (m) => m.author.id === this.member.id;

            const messages = await this.channel.awaitMessages(filter, {
                max: 1,
                time: 600000,
                errors: ['time'],
            });

            const age = messages.first().content.replace(/[^.0-9]/g, '');

            if (age == '') return true;

            const isTooYoung = age < minAge;

            if (isTooYoung) {
                await this.channel.send('', {
                    embed: {
                        color: 0xf0131e,
                        title: 'Age Verification',
                        description:
                            'Unfortunately you are not old enough to use Discord. You must be at least 13 to participate in this server.',
                    },
                });

                await this.member.ban({
                    reason: `User is ${age} years old`,
                });

                try {
                    const webhookClient = await getModLogChannel();
                    if (!webhookClient) return;

                    await webhookClient.send({
                        embeds: [
                            {
                                author: {
                                    name: `${this.member.user.username}#${this.member.user.discriminator}`,
                                    icon_url: this.member.user.displayAvatarURL(
                                        {
                                            dynamic: true,
                                        }
                                    ),
                                },
                                timestamp: new Date(),
                                color: 0xff2c02,
                                description: `${this.member} has been banned due to failing the middle school age check.`,
                                fields: [
                                    { name: '**Claimed Age**', value: age },
                                ],
                            },
                        ],
                    });
                } catch (ex) {
                    this.client.logger.error(ex);
                }
            } else {
                await this.channel.send('', {
                    embed: {
                        color: 0x00f763,
                        title: 'Age Verification',
                        description:
                            'Thank you for verifying your age! I have added the middle school role to you!',
                    },
                });
            }

            this.isActive = false;
            this.client.openedTickets.delete(this.member.id);

            return isTooYoung;
        } catch (err) {
            this.client.logger.error(err);

            await this.channel.send(
                'This request has timed out, please try again later.'
            );

            this.isActive = false;
            this.client.openedTickets.delete(this.member.id);
            return true;
        }
    }
}

module.exports = AgeVerification;
