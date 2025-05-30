import { AmethystCommand } from "amethystjs";
import { User } from "discord.js";
import { greenEmbed, mergeEmbeds, orangeEmbed, userEmbed } from "./base";
import { prefix } from "../data/hard/configs.json";
import { getPermission } from "../utils/getters";
import { removeNullElements } from "../utils/toolbox";

export const commandHelpEmbed = (user: User, command: AmethystCommand) => mergeEmbeds(userEmbed(user), orangeEmbed()).setTitle('Aide').setDescription(`Commande \`${prefix}${command.options.name}\`\n\n**Description :** ${command.options.description}\n\n**Alias :** ${command.options.aliases?.length ? command.options.aliases.join(', ') : 'Aucun'}`).addFields(removeNullElements([    
    command.options.permissions?.length > 0 ? {
        name: "Permissions requises",
        value: command.options.permissions.map(x => getPermission(x)).join(', '),
        inline: false
    } : null,
    command.options.clientPermissions?.length > 0 ? {
        name: "Permissions du bot",
        value: command.options.clientPermissions.map(x => getPermission(x)).join(', '),
        inline: false
    } : null
]));
export const helpCommand = (user: User, commands: AmethystCommand[], prefix: string) => mergeEmbeds(userEmbed(user), orangeEmbed()).setTitle('Aide').setDescription(`Voici les commandes disponibles :\n\n${commands.map(x => `\`${prefix}${x.options.name}\` : ${x.options.description}`).join('\n')}`)