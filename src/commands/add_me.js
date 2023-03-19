const { Command } = require('../Classes/Command');

class add_me extends Command {
    constructor(client) {
        super("add_me", "Add yourself to alarm list");
        this.client = client;
    }

    async run(interaction) {
        const add = await this.client.voiceService.addMember(interaction.member);
        if(add.error != null) return interaction.reply({ content: add.error, ephemeral: true });
        
        await interaction.reply({ content: "You have been added to the alarm list", ephemeral: true });
    }
}

module.exports = add_me;