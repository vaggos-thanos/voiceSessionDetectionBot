require('dotenv').config();
const Bot = require("./Classes/Bot.js");
const { GatewayIntentBits } = require("discord.js");

const client = new Bot({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildModeration,
    ]
});

client.Start(process.env.TOKEN);