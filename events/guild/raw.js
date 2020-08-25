const events = {
    MESSAGE_REACTION_ADD: 'messageReactionAdd',
    MESSAGE_REACTION_REMOVE: 'messageReactionRemove',
};

module.exports = async (client, event) => {
    return;
    if (!events.hasOwnProperty(event.t)) return;

    const { d: data } = event;
    const user = await client.users.fetch(data.user_id);
    const channel = await (client.channels.fetch(data.channel_id) ||
        user.createDM());

    const message = await channel.messages.fetch(data.message_id);
    if (!message) return;

    const emojiKey = data.emoji.id
        ? `${data.emoji.name}:${data.emoji.id}`
        : data.emoji.name;

    const reaction = message.reactions.cache.get(emojiKey);

    await sleep(750);

    client.emit(events[event.t], reaction, user);
};

const sleep = async (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};
