const User = require('../../db/models/users');
const { setToRole, removeRole } = require('../../modules/UserHelpers');
const mongoose = require('mongoose');
const topTutor = require('../basic/topTutor').execute;

module.exports = {
    name: 'test',
    adminOnly: true,
    guildOnly: true,
    category: 'admin',
    async execute(message) {
        const client = message.client;

        try {
            throw new Error('Test');
        } catch (ex) {
            client.logger.error(ex.message, ex.stack);
            client.emit('error', ex.message, ex.stack);
        }
    },
};
