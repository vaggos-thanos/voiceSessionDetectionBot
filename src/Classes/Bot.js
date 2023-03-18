const { REST, Routes, Client, Collection } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const functions = require("./functions");
const prompt = require('prompt-sync')();

module.exports = class Bot extends Client {
    constructor(args) {
        super(args);

        this.commands = new Collection();
        this.subCommands = new Collection();
        this.events = new Collection();
        this.functions = new functions();
    }

    async InitCommands(dir) {
        const commands = fs.readdirSync(path.join(__dirname, dir))
        for (const file of commands) {
            if(file.endsWith('.js')) {
                const CmdFile = await require(path.join(__dirname, dir, file))
                const command = new CmdFile(this)
                if(command.name !== file.split(".js")[0]) return console.log(`Command name mismatch: ${file} vs ${command.name}`)
                await this.commands.set(command.name, command)
                console.log(`Loaded command: ${file}`)
            } else if (fs.lstatSync(path.join(__dirname, dir, file)).isDirectory()) {
                this.InitSubCommands(path.join(dir, file))
            } else {
                console.log(`Ignored file: ${file}`)
            }
        }
    }

    async InitSubCommands(dir) {
        const commands = fs.readdirSync(path.join(__dirname, dir))
        for (const file of commands) {
            if (file.endsWith('.js')) {
                if (file.split(".js")[0] == "index"){
                    const CmdFile = require(path.join(__dirname, dir, file))
                    const command = new CmdFile(this)
                    this.subCommands.set(command.name, command)
                    console.log(`Loaded SubCommandHandler: ${command.name}`)
                }
            } else if (fs.lstatSync(path.join(__dirname, dir, file)).isDirectory()) {
                this.InitSubCommands(path.join(dir, file))
            } else {
                console.log(`Ignored file: ${file}`)
            }
        }
    }

    async InitEvents(dir) {
        const events = fs.readdirSync(path.join(__dirname, dir))
        for (const file of events) {
            if(file.endsWith('.js')) {
                const CmdFile = await require(path.join(__dirname, dir, file))
                const event = new CmdFile(this)
                await this.events.set(event.name, event)
                if(event.once) {
                    this.once(event.name, (...args) => event.run(...args))
                } else {
                    this.on(event.name, (...args) => event.run(...args))
                }
                console.log(`Loaded listener: ${file}`)
            } else if (fs.lstatSync(path.join(__dirname, dir, file)).isDirectory()) {
                this.InitEvents(path.join(dir, file))
            } else {
                console.log(`Ignored file: ${file}`)
            }
        }
    }

    async SlashCommandBuild(ClientID, GuildID, scope, autoStart = false) {
        ClientID = !ClientID ? prompt('What is your client id?') : ClientID;
        GuildID = !GuildID ? prompt('What is your guild id?') : GuildID;
        scope = !scope ? prompt('What is your scope?') : scope;

        console.log(`Building slash command for ${GuildID}`)
        const SlashCommands = [];

        await this.InitCommands('../commands');
        const commands = this.commands
        const subCommands = this.subCommands

        for (const [name, command] of commands) {
            await SlashCommands.push((command.getSlashCommandBuilder()).toJSON())
            console.log(`Slash Command is Ready for Build: ${name}`)
        }

        for ( const [name, subCommand] of subCommands) {
            const slashCommandBuilder = subCommand.getSlashCommandBuilder()
            await SlashCommands.push(slashCommandBuilder.toJSON())
            console.log(`SubCommand handler is Ready for Build: ${name}`)
        }

        console.log(`Registering slash commands for ${GuildID}`);
        console.log(`Client ID: ${ClientID}`);
        const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

        if(scope == "local") {
            rest.put(Routes.applicationGuildCommands(ClientID, GuildID), { body: SlashCommands })
            .then(() => console.log('Successfully registered application commands [LOCAL].'))
            .catch(error => {
                console.log(`Error registering application commands: ${error}`)
                console.log(error);
            });
        } else if (scope == "global") {
            rest.put(Routes.applicationCommands(ClientID), { body: SlashCommands })
            .then(() => console.log('Successfully registered application commands [GLOBAL].'))
            .catch(error => {
                console.log(`Error registering application commands: ${error}`)
            });
        }

        if(autoStart == false) return;
        const startBot = prompt('Do you want to start the bot? (y/n)')
        if(startBot.toLowerCase() == "y") {
            console.log('Starting bot... in 5 seconds')
            await this.functions.sleep(5000)
            this.Start(process.env.TOKEN)
        } else {
            console.log('Bot not started')
        }
    }

    async Start(token) {
        await this.InitCommands('../commands');
        await this.InitEvents('../listeners');
        await super.login(token);
    }
}