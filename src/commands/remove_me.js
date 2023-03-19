const { Command } = require('../Classes/Command');

class remove_me extends Command {
    constructor(client) {
        super("remove_me", "Remove yourself from alarm list");
        this.client = client;
    }

    async run(interaction) {
        const remove = await this.client.voiceService.removeMember(interaction.member);
        if(remove.error != null ) return interaction.reply({ content: remove.error, ephemeral: true });
        
        await interaction.reply({ content: "You have been removed from the alarm list", ephemeral: true });
    }
}

module.exports = remove_me;