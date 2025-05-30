import { AmethystCommand, log4js } from "amethystjs";
import { commandHelpEmbed, helpCommand } from "../../embeds/help";
import { sendOrReply } from "../../utils/toolbox";

export default new AmethystCommand({
    name: "help",
    aliases: ['aide', 'commands', 'commandes'],
    description: "Affiche la liste des commandes disponibles et leurs descriptions"
}).setMessageRun(async({ client, message, options }) => {
    const cmd = options.first?.toLowerCase?.()
    const commands = client.messageCommands
    
    if (cmd) {
        const target = commands.find(x => x.options.name === cmd || x.options.aliases?.includes?.(cmd))
        
        return sendOrReply(message, {embeds: [commandHelpEmbed(message.author, target)]}).catch(log4js.trace)
    }

    const prefix = message.inGuild() ? client.prefixesManager.getPrefix(message.guildId) : client.configs.prefix
    sendOrReply(message, { embeds: [helpCommand(message.author, commands, prefix)] })
})