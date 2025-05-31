import { AmethystCommand } from "amethystjs";
import { APIEmbedField, ApplicationCommandChoicesData, ApplicationCommandOptionData, ApplicationCommandOptionType, User } from "discord.js";
import { botAvatar, greenEmbed, mergeEmbeds, orangeEmbed, userEmbed } from "./base";
import { prefix } from "../data/hard/configs.json";
import { getPermission } from "../utils/getters";
import { removeNullElements } from "../utils/toolbox";

const recursiveCommandOptionDescription = (option: ApplicationCommandOptionData, level = 0) => {
    const displayFromLevel = `- `.padStart(level * 2 + 2, ' ');
    const names: Record<ApplicationCommandOptionType, string> = {
        [ApplicationCommandOptionType.String]: 'texte',
        [ApplicationCommandOptionType.Boolean]: 'déclencheur',
        [ApplicationCommandOptionType.Integer]: 'nombre',
        [ApplicationCommandOptionType.User]: 'utilisateur',
        [ApplicationCommandOptionType.Channel]: 'salon',
        [ApplicationCommandOptionType.Role]: 'rôle',
        [ApplicationCommandOptionType.Mentionable]: 'mentionnable',
        [ApplicationCommandOptionType.Number]: 'nombre décimal',
        [ApplicationCommandOptionType.Attachment]: 'fichier',
        [ApplicationCommandOptionType.Subcommand]: 'sous-commande',
        [ApplicationCommandOptionType.SubcommandGroup]: 'groupe',
    }
    const typeName = names[option.type] ?? 'Autre';

    if (option.type === ApplicationCommandOptionType.SubcommandGroup) {
        return `${displayFromLevel}**${option.name}** (${typeName}) : ${option.description}\n${option.options.map(x => recursiveCommandOptionDescription(x, level + 1)).join('\n')}`;
    } else if (option.type === ApplicationCommandOptionType.Subcommand) {
        return `${displayFromLevel}**${option.name}** (${typeName}) : ${option.description}\n${option.options?.map(x => recursiveCommandOptionDescription(x, level + 1)).join('\n') ?? ''}`;
    } else {
        return `${displayFromLevel}**${option.name}** (${option.required ? 'requis' : 'optionnel'}): ${option.description} (${typeName})${(option as ApplicationCommandChoicesData).choices?.length > 0 ? ` choix: ${(option as ApplicationCommandChoicesData).choices.map(x => `\`${x.name}\``).join(', ')}` : ''}`
    }
}

export const commandHelpEmbed = (user: User, command: AmethystCommand) => {
    const embed = mergeEmbeds(userEmbed(user), orangeEmbed(), botAvatar(user))
        .setTitle('Aide')
        .setDescription(`Commande \`${prefix}${command.options.name}\`\n\n**Description :** ${command.options.description}\n\n**Alias :** ${command.options.aliases?.length ? command.options.aliases.map(x => `\`${x}\``).join(', ') : 'Aucun'}\n\n**Cooldown :** \`${command.options.cooldown ?? user.client.configs.defaultCooldownTime}s\``)
        .addFields(removeNullElements([    
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
        ]))

        if (command.options.options?.length > 0) {
            const groups = command.options.options.filter(x => x.type === ApplicationCommandOptionType.SubcommandGroup);
            if (groups.length > 0) {
                groups.forEach((group) => {
                    embed.addFields({
                        name: `Groupe ${group.name} de sous-commandes`,
                        value: `> ${group.description}\n\n${group.options.map(x => recursiveCommandOptionDescription(x)).join('\n')}`,
                    })
                })

                if (command.options.options.filter(x => x.type !== ApplicationCommandOptionType.SubcommandGroup).length > 0) {
                    embed.addFields({
                        name: "Autres options",
                        value: command.options.options.filter(x => x.type !== ApplicationCommandOptionType.SubcommandGroup).map(x => recursiveCommandOptionDescription(x)).join('\n'),
                        inline: false
                    });
                }
            } else {
                embed.addFields({
                    name: "Options",
                    value: command.options.options.map(x => recursiveCommandOptionDescription(x)).join('\n'),
                    inline: false
                });
            }
        }

    return embed
};
export const helpCommand = (user: User, commands: AmethystCommand[], prefix: string) => mergeEmbeds(userEmbed(user), orangeEmbed(), botAvatar(user)).setTitle('Aide').setDescription(`Voici les commandes disponibles :\n\n${commands.map(x => `\`${prefix}${x.options.name}\` : ${x.options.description}`).join('\n')}`)