import { AmethystCommand, log4js, preconditions } from "amethystjs";
import started from "../../preconditions/started";
import { ApplicationCommandOptionType, AttachmentBuilder } from "discord.js";
import { sendOrReply } from "../../utils/toolbox";
import { getEmoji } from "../../utils/getters";

export default new AmethystCommand({
    name: 'carte',
    aliases: ['map'],
    description: "Affiche la carte de l'aventure en cours",
    preconditions: [preconditions.GuildOnly, started],
    options: [
        {
            name: "sans-texte",
            description: "Affiche la carte sans les textes des lieux",
            required: false,
            type: ApplicationCommandOptionType.Boolean
        }
    ],
    clientPermissions: ['AttachFiles']
}).setMessageRun(async({ message, options, client }) => {
    if (message.channel.isSendable()) {
        message.channel.sendTyping().catch(log4js.trace)
    }
    const noText = options.args.map(x => x.toLowerCase()).includes('sans-texte')
    const file = `${noText ? 'map' : 'map_titles'}.png`;

    const attachment = new AttachmentBuilder(`./dist/data/assets/${file}`, { name: "map.png" })

    sendOrReply(message, {
        files: [attachment],
        content: `${getEmoji('star')}`
    }).catch(log4js.trace)
})