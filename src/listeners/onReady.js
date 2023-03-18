const { Events } = require('discord.js');
const Event = require('../Classes/Event');

module.exports = class onReady extends Event {
    constructor(client) {
        super(Events.ClientReady, true);
        this.client = client;
    }

    async run() {
        await this.client.functions.log('Logged in as ' + this.client.user.tag);
        
        while(true) {
            const guilds = this.client.guilds.cache
            const usersCount = await guilds.reduce(async (total, guild) => {
                return await total + guild.memberCount;
            }, 0)
            
            const botUsers = await guilds.reduce(async (total, guild) => {
                await guild.members.fetch();
                const bots = await guild.members.cache.filter(member => member.user.bot).size;
                if(await total == 0) return bots;
                
                return await total + bots;
            }, 0)

            this.client.user.setPresence({activities: [{name: `${this.client.guilds.cache.size} servers | ${usersCount - botUsers} users` , type: 3 }], status: "online"}) 

            await this.client.functions.sleep(1000 * 10)            
        }
    }
}