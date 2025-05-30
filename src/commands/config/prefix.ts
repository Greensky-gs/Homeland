import { AmethystCommand, log4js, preconditions } from "amethystjs";
import { ApplicationCommandOptionType, ChannelType } from "discord.js";
import configs from "../../database/models/configs";
import { sendOrReply } from "../../utils/toolbox";
import { configurations } from "../../cache/configurations";

export default new AmethystCommand({
    name: 'prefix',
    description: "Configure le préfixe du bot",
    aliases: ['setprefix', 'set-prefix', 'préfixe', 'préfix', 'prefixe'],
    preconditions: [preconditions.GuildOnly],
    permissions: ['ManageGuild'],
    messageInputChannelTypes: [ChannelType.GuildText],
    options: [
        {
            name: "préfixe",
            description: "Nouveau préfixe à définir",
            required: false,
            type: ApplicationCommandOptionType.String
        }
    ]
}).setMessageRun(async({ client, options, message }) => {
    const newPrefix = options.first

    if (!newPrefix) {
        const currentPrefix = client.prefixesManager.getPrefix(message.guildId)
        return sendOrReply(message, `⚙️ | Le préfixe actuel est \`${currentPrefix}\`\nVous pouvez le modifier avec \`${currentPrefix}${options.commandName} nouveau_prefixe\``).catch(log4js.trace)
    }

    client.prefixesManager.setPrefix({
        guildId: message.guildId,
        prefix: newPrefix
    })

    configurations.update(message.guildId, 'prefix', newPrefix).catch(log4js.trace)

    sendOrReply(message, `⚙️ | Le préfixe a été mis à jour en \`${newPrefix}\``).catch(log4js.trace)
})