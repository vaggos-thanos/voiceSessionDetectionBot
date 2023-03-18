const { Command } = require('../Classes/Command');

class removeMe extends Command {
    constructor(client) {
        super("removeMe", "Remove yourself from alarm list");
    }

    async run(interaction) {
        
    }
}

module.exports = removeMe;