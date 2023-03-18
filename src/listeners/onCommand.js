const { Events } = require('discord.js');
const Event = require('../Classes/Event.js')

module.exports = class onCommand extends Event {
    constructor(client) {
        super(Events.InteractionCreate);
        this.client = client;
    }

    async run(interaction) {
        try {
            if (!interaction.isCommand()) return;
            const guildConfig = await this.client.GuildConfigs.get(interaction.guildId)
            let SubCommandName = null;
            if(interaction.options._subcommand != null) {
                this.client.subCommands.get(interaction.commandName).subCommands.forEach(subCommand => {
                    const subCommandName = new subCommand(this.client)
                    if(subCommandName.name == interaction.options._subcommand) {
                        SubCommandName = subCommandName 
        
                    }    
                })
            }
            
            const command = SubCommandName == null ? this.client.commands.get(interaction.commandName) : SubCommandName;
            if (!command) return;
            await command.run(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: "There was an error with the command", ephemeral: true });
        }
    }
}