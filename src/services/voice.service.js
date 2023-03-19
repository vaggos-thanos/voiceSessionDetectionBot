const { Collection, EmbedBuilder } = require('discord.js');
const fs = require('fs');
module.exports = class voiceService {
    constructor(client) {
        this.client = client;
        this.users = new Collection();
    }

    // create a method to add a member to json file and initialize a timer for them
    async init() {
        const data = JSON.parse(fs.readFileSync('./src/data/voice.json', 'utf8'));
        for (const [key, value] of Object.entries(data)) {
            this.users.set(value.id, value);
        }
    }

    async addMember(member) {
        console.log(await this.users.filter(user => user.id == member.id).size > 0)
        if(await this.users.filter(user => user.id == member.id).size > 0) return { error: "User already exists" };
        this.users.set(member.id, member.user);
        fs.writeFileSync('./src/data/voice.json', JSON.stringify(this.users));
        return { error: null };
    }

    async removeMember(member) {
        console.log(await this.users.filter(user => user.id == member.id).size == 0)
        if(await this.users.filter(user => user.id == member.id).size == 0) return { error: "User does not exist" };
        fs.writeFileSync('./src/data/voice.json', JSON.stringify(this.users));
        return { error: null };
    }

    async checkVoice(oldState, newState) {
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
    
        const friends = this.users.map(user => user.id)
        const user_in_channel = newMember.channel.members.map(member => member.id)
                
        if (oldMember.channelId === null) {
            //join
            const embed = new EmbedBuilder()
                .setTitle('Mpes CALLLLLLL')
                .setDescription(`**${member.user.username}** is calling you on **${newMember.channel}**`)
                .setColor("#22d395")
                .setTimestamp()
                .setFooter({text: "Mpes CALLLLLLL"})
    
            for(const friend of friends) {
                if(member.id != friend && user_in_channel != friend) {
                    const friendMember = guild.members.cache.get(friend)
                    friendMember.send({embeds: [embed]})
                }
            }
        }
    }
}