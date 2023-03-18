require('dotenv').config();
const { GatewayIntentBits } = require("discord.js");
const Bot = require("./Classes/Bot.js");

const client = new Bot({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
    ]
})

client.SlashCommandBuild(undefined, undefined, 'local', false)
