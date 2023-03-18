const { Command } = require('../Classes/Command');

class addMe extends Command {
    constructor(client) {
        super("addMe", "Add yourself to alarm list");
    }

    async run(interaction) {

    }
}

module.exports = addMe;