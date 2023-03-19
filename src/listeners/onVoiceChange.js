const { Events } = require("discord.js");
const Event = require("../Classes/Event");

module.exports = class onVoiceChange extends Event {
    constructor(client) {
        super(Events.VoiceStateUpdate, false);
        this.client = client;
    }

    async run(oldMember, newMember) {
        try {
            this.client.voiceService.checkVoice(oldMember, newMember);
        } catch (error) {
            this.client.functions.log(error, error)
        }
    }
}