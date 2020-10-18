const Ticket = require('../classes/Ticket');
class AgeVerification extends Ticket {
    constructor(client, member, channel) {
        super(true);
        this.member = member;
        this.channel = channel;
        this.client = client;

        this.client.openedTickets.set(this.member.id, this);
    }

    async handleConvo(channel = null) {
        if (channel) this.channel = channel;

        try {
            const filter = (m) => m.author.id === this.member.id;

            const messages = await this.channel.awaitMessages(filter, {
                max: 1,
                time: 600000,
                errors: ['time'],
            });

            const age = messages.first().content.replace(/\D/g, '');

            const isTooYoung = age < minAge;

            if (isTooYoung) {
                await this.channel.send(
                    'Unfortunately you are not old enough to participate in this server, you will be temporality banned from this server'
                );

                await this.member.ban({
                    days: 14,
                    reason: `User is ${age} years old`,
                });
            } else {
                await this.channel.send(
                    'Thank you for verifying your age! I have added the middle school role to you!'
                );
            }

            this.isActive = false;
            this.client.openedTickets.delete(this.member.id);

            return isTooYoung;
        } catch (err) {
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
