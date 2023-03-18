const { Collection } = require('discord.js');
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
            this.users.set(key, value);
        }
    }

    async addMember(member) {
        this.users.set(member.id, member.user);
        fs.writeFileSync('./src/data/voice.json', JSON.stringify(this.users));
    }

    async removeMember(member) {
        this.users.delete(member.id);
        fs.writeFileSync('./src/data/voice.json', JSON.stringify(this.users));
    }
}