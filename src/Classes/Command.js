const { SlashCommandBuilder, SlashCommandSubcommandBuilder } = require('@discordjs/builders');

class Command {
    constructor(name, description) {
        this.name = name;
        this.description = description;
    }

    getSlashCommandBuilder() {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
    }

    run(interaction) {}
}

class SubCommandHandler extends Command {
    constructor(client, name, description, cooldown, ownerOnly, SubCommands) {
        super(name, description, cooldown, ownerOnly);
        this.client = client;
        this.subCommands = SubCommands;
    }

    getSlashCommandBuilder() {
        const builder = super.getSlashCommandBuilder();
        if(this.subCommands.length > 0) {
            for (const SubCommand of this.subCommands) {
                console.log(SubCommand)
                const subCommand = new SubCommand(this.client).getSlashCommandBuilder()
                builder.addSubcommand(subCommand)
            }
        } 


        return builder;
    }

    async run(interaction) {
        if(!interaction.isCommand()) return;

        const subCommands = interaction.options.getSubcommand();

        for (const subCommand of this.subCommands) {
            if (subCommand.name === subCommands) {
                await new subCommand(this.client).run(interaction);
                return;
            }
        }
    }
}

class SubCommand extends Command {
    getSlashCommandBuilder() {
        return new SlashCommandSubcommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
    }

    run (interaction) {}
}

module.exports = { 
    Command,
    SubCommand,
    SubCommandHandler
};