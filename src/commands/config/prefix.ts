import { AmethystCommand, log4js, preconditions } from "amethystjs";
import { ChannelType } from "discord.js";
import configs from "../../database/models/configs";
import { sendOrReply } from "../../utils/toolbox";

export default new AmethystCommand({
    name: 'prefix',
    description: "Configure le préfixe du bot",
    aliases: ['setprefix', 'set-prefix', 'préfixe', 'préfix', 'prefixe'],
    preconditions: [preconditions.GuildOnly],
    permissions: ['ManageGuild'],
    messageInputChannelTypes: [ChannelType.GuildText]
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

    configs.findOrCreate({
        where: { guild_id: message.guildId },
        defaults: { guild_id: message.guildId, prefix: newPrefix }
    }).then(([val, created]) => {
        if (!created) val.update({ prefix: newPrefix }).catch(log4js.trace)
    })

    sendOrReply(message, `⚙️ | Le préfixe a été mis à jour en \`${newPrefix}\``).catch(log4js.trace)
})