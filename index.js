require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
        // GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildMessages,
    ]
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('voiceStateUpdate', async (oldState, newState) => {
    if(newState.mute) return;
    if(newState.selfDeaf) return;
    if(newState.selfMute) return;
    if(newState.selfVideo) return;
    if(newState.serverDeaf) return;
    if(newState.serverMute) return;

    const guild =   newState.guild
    const oldMember = oldState
    const newMember = newState
    const member = guild.members.cache.get(newMember.id)

    const friends = ['469897864961851422', '588416409407848457', '630780651238326272']
    
    
    if (newMember.channelId === null) {
        //leave


    } else if (oldMember.channelId === null) {
        //join
        const embed = new EmbedBuilder()
            .setTitle('Mpes CALLLLLLL')
            .setDescription(`**${member.user.username}** is calling you on **${newMember.channel}**`)
            .setColor("#00ffee")
            .setTimestamp()
            .setFooter({text: "Mpes CALLLLLLL"})

        for(const friend of friends) {
            if(member.id != friend) {
                const friendMember = guild.members.cache.get(friend)
                friendMember.send({embeds: [embed]})
            }
        }

    } else if (oldMember.channelId !== newMember.channelId) {
        //switch

    }
    
});

client.login(process.env.token);