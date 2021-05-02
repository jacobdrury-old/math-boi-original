const User = require('../../db/models/users');
const { setToRole, removeRole } = require('../../modules/UserHelpers');
const mongoose = require('mongoose');
const topTutor = require('../basic/topTutor').execute;
const { logger } = require('../../classes/ErrorLogging');

module.exports = {
    name: 'test',
    adminOnly: true,
    guildOnly: true,
    category: 'admin',
    async execute(message) {
        const client = message.client;

        try {
            throw 'Error2';
        } catch (ex) {
            logger.error(ex);
        }
    },
};
