const colors = require('ansi-colors');
const { EmbedBuilder } = require('discord.js');

class functions {
    async log(str, error) {
        function formatDate(date) {
            var day = date.getDate();
            var month = date.getMonth() + 1;
            var year = date.getFullYear();
            var hours = date.getHours();
            var mins  = date.getMinutes();
            var secs  = date.getSeconds();
            
            day = (day < 10 ? "0" : "") + day;
            month = (month < 10 ? "0" : "") + month;
            year = (year < 10 ? "0" : "") + year;
            hours = (hours < 10 ? "0" : "") + hours;
            mins = (mins < 10 ? "0" : "") + mins;
            secs = (secs < 10 ? "0" : "") + secs;

            return `${hours}:${mins}:${secs} ${day}/${month}/${year}`;
        }
        if(error) {
            console.log(colors.red(`[${formatDate(new Date())}] ${str}`));
            console.log(error);
        } else {
            console.log(`${colors.cyan(`[${formatDate(new Date())}]:`)} ${str}`);
        }
        
    }

    sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }

    async isOwner(member) {
        try {
            const users = ['667357315950706704']

            const state = users.reduce((result, user) => {
                return result || user == member
            }, false);
            return state;

        } catch (error) {
           this.log(error, error)
            return false
        }
    }

    async isAuthor(id) {
        try {
            const authors = ['588416409407848457'] /*Vaggos[1] */
            if (authors[0] == id) {
                return true
            }

            return false
        } catch (error) {
           this.log(error, error)
            return false
        }
    }

    async autoMessage(client, guildId) {
        try {
            const guild = client.guilds.cache.get(guildId);
            const channel = guild.channels.cache.get('746856547086499896')
            const channel1 = guild.channels.cache.get('970199739092070400')

            const message = client.language.LangTranslate('autoMessage', guildId);
            const time = 1000 * 60 * 60 * 24 * 2 // 1 day

            setInterval(() => {
                sendMessage(channel, channel1, message)
            }, time);

            async function sendMessage(channel, channel1, message) {
                if(channel != undefined) {
                    const embed = new EmbedBuilder();
                    embed.setDescription(message);
                    embed.setColor('#ff0000a')
                    embed.setTimestamp()
                    embed.setThumbnail(guild.iconURL())
        
                    channel.send({embeds: [embed], content: '@everyone'})
                    channel1.send({embeds: [embed], content: '@everyone'})

                }
            }
        } catch (error) {
            this.log(error);
        }
    }

}

module.exports = functions;