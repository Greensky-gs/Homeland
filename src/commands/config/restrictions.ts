import { AmethystCommand, log4js, preconditions, waitForMessage } from "amethystjs";
import { ApplicationCommandOptionType, ChannelType, Message, TextChannel } from "discord.js";
import { findChannelInMessage, findRoleInMessage, sendOrReply, waitForChannelMessage, waitForRoleMessage } from "../../utils/toolbox";
import { configurations } from "../../cache/configurations";
import { baseEmbed, mergeEmbeds, orangeEmbed, userEmbed } from "../../embeds/base";

export default new AmethystCommand({
    name: "restrictions",
    aliases: ['restriction', 'restr'],
    description: "Gère les restrictions de jeu du serveur",
    preconditions: [preconditions.GuildOnly],
    permissions: ['ManageGuild', 'ManageRoles', 'ManageChannels'],
    options: [
        {
            name: 'salons',
            description: "Gère les salons autorisés ou interdits",
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [
                {
                    name: 'autorisés',
                    description: "Gère les salons autorisés (seulements ces salons peuvent être utilisés)",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'action',
                            description: "L'action à effectuer",
                            type: ApplicationCommandOptionType.String,
                            choices: [
                                {
                                    name: 'ajouter',
                                    value: 'add'
                                },
                                {
                                    name: 'retirer',
                                    value: 'remove'
                                },
                                {
                                    name: 'lister',
                                    value: 'list'
                                }
                            ],
                            required: true
                        },
                        {
                            name: 'salon',
                            description: "Le salon à ajouter ou retirer",
                            type: ApplicationCommandOptionType.Channel,
                            channelTypes: [ChannelType.GuildText],
                            required: false
                        }
                    ]
                },
                {
                    name: 'interdits',
                    description: "Gère les salons interdits (ces salons ne peuvent pas être utilisés)",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'action',
                            description: "L'action à effectuer",
                            type: ApplicationCommandOptionType.String,
                            choices: [
                                {
                                    name: 'ajouter',
                                    value: 'add'
                                },
                                {
                                    name: 'retirer',
                                    value: 'remove'
                                },
                                {
                                    name: 'lister',
                                    value: 'list'
                                }
                            ],
                            required: true
                        },
                        {
                            name: 'salon',
                            description: "Le salon à ajouter ou retirer",
                            type: ApplicationCommandOptionType.Channel,
                            channelTypes: [ChannelType.GuildText],
                            required: false
                        }
                    ]
                }
            ]
        },
        {
            name: 'rôles',
            description: "Gère les rôles autorisés ou interdits",
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [
                {
                    name: 'autorisés',
                    description: "Gère les rôles autorisés (seulements ces rôles peuvent utiliser les commandes)",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'action',
                            description: "L'action à effectuer",
                            type: ApplicationCommandOptionType.String,
                            choices: [
                                {
                                    name: 'ajouter',
                                    value: 'add'
                                },
                                {
                                    name: 'retirer',
                                    value: 'remove'
                                },
                                {
                                    name: 'lister',
                                    value: 'list'
                                }
                            ],
                            required: true
                        },
                        {
                            name: 'rôle',
                            description: "Le rôle à ajouter ou retirer",
                            type: ApplicationCommandOptionType.Role,
                            required: false
                        }
                    ]
                },
                {
                    name: 'interdits',
                    description: "Gère les rôles interdits (ces rôles ne peuvent pas utiliser les commandes)",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'action',
                            description: "L'action à effectuer",
                            type: ApplicationCommandOptionType.String,
                            choices: [
                                {
                                    name: 'ajouter',
                                    value: 'add'
                                },
                                {
                                    name: 'retirer',
                                    value: 'remove'
                                },
                                {
                                    name: 'lister',
                                    value: 'list'
                                }
                            ],
                            required: true,
                        },
                        {
                            name: 'rôle',
                            description: "Le rôle à ajouter ou retirer",
                            type: ApplicationCommandOptionType.Role,
                            required: false
                        }
                    ]
                }
            ]
        }
    ]
}).setMessageRun(async({ message, options, client }) => {
    const configs = configurations.getGuildConfig(message.guildId)
    const group = options.first

    const displayConfigs = () => {
        const embed = mergeEmbeds(userEmbed(message.author), orangeEmbed())
            .setTitle("Configurations")
            .setDescription(`Configurations des restrictions de jeu.\n\n💡 Rappel\n> Les salons autorisés font que les commandes jeux ne peuvent êtres exécutées que dans ces salons.\n> Les salons interdits sont des salons dans lesquels on ne peut pas utiliser les commandes de jeu.\n> De même pour les rôles`)
            .setFields(
                {
                    name: "Salons autorisés",
                    value: configs.only_channels.length > 0 ? configs.only_channels.map(x => `<#${x}>`).join(', ') : "Aucun salon n'est autorisé (les commandes de jeu peuvent être utilisées partout)",
                    inline: true
                },
                {
                    name: "Salons interdits",
                    value: configs.denied_channels.length > 0 ? configs.denied_channels.map(x => `<#${x}>`).join(', ') : "Aucun salon n'est interdit (les commandes de jeu peuvent être utilisées partout)",
                    inline: true
                },
                {
                    name: '\u200b',
                    value: '\u200b',
                    inline: false
                },
                {
                    name: "Rôles autorisés",
                    value: configs.only_roles.length > 0 ? configs.only_roles.map(x => `<@&${x}>`).join(', ') : "Aucun rôle n'est autorisé (les commandes de jeu peuvent être utilisées par tout le monde)",
                    inline: true
                },
                {
                    name: "Rôles interdits",
                    value: configs.deny_roles.length > 0 ? configs.deny_roles.map(x => `<@&${x}>`).join(', ') : "Aucun rôle n'est interdit (les commandes de jeu peuvent être utilisées par tout le monde)",
                    inline: true
                }
            )

        sendOrReply(message, {
            embeds: [embed]
        }).catch(log4js.trace)
    }

    if (!group) {
        displayConfigs()
        return
    }

    if (['salons', 'channels', 's'].includes(group.toLowerCase())) {
        let type = options.second

        if (!type) {
            displayConfigs()
            return
        }

        const allowedSubcommands = ['autorisés', 'allowed', 'autorises', 'autorisé', 'autorise', 'a']
        const deniedSubcommands = ['interdits', 'denied', 'interdi', 'i']
        const validCommands = allowedSubcommands.concat(deniedSubcommands)

        if (!validCommands.includes(type.toLowerCase())) {
            const msg = await sendOrReply(message, {
                content: `❓ | La commande est invalide. Laquelle voulez-vous utiliser ?\n\nVoulez-vous configurer les salons **autorisés** ou **interdits** ?\n> Répondez dans le chat, et par \`cancel\` pour annuler`
            }).catch(log4js.trace)
            if (!msg) return

            const response = await waitForMessage({
                channel: msg.channel as TextChannel,
                user: message.author,
                whoCanReply: 'useronly'
            }).catch(log4js.trace)

            if (response && response.deletable) response.delete().catch(log4js.trace)
            if (!response || response.content.toLowerCase() === 'cancel') {
                return msg.edit(`💡 | Annulé`).catch(log4js.trace)
            }

            if (!validCommands.includes(response.content.toLowerCase())) return msg.edit(`❌ | La commande \`${response.content}\` n'est pas valide. Veuillez réessayer la commande.`).catch(log4js.trace)
            
            msg.delete().catch(log4js.trace)

            type = response.content.toLowerCase()
        }
        const purifiedType = allowedSubcommands.includes(type.toLowerCase()) ? 'allowed' : 'denied';

        let action = options.args[2]?.toLowerCase()

        const actionsAdd = ['ajouter', 'add', 'ajouté', 'ajoute', 'a', 'push', 'append']
        const actionsRemove = ['retirer', 'supprimer', 'pop', 'r', 'retiré', 'supprime', 'retire', 'remove']
        const listActions = ['lister', 'list', 'l', 'show', 'voir']
        const allowedActions = actionsAdd.concat(actionsRemove).concat(listActions);
        
        if (!action) {
            const channels = configs[purifiedType === 'allowed' ? 'only_channels' : 'denied_channels'];
            const embed = mergeEmbeds(userEmbed(message.author), orangeEmbed())
                .setTitle(purifiedType === "allowed" ? "Salons autorisés" : "Salons interdits")
                .setDescription(channels.length > 0 ? channels.map(x => `<#${x}>`).join(', ') : `Aucun salon ${purifiedType === 'allowed' ? 'autorisé' : 'interdit'}.`)

            return sendOrReply(message, {
                embeds: [embed]
            }).catch(log4js.trace);
        }

        if (!allowedActions.includes(action)) {
            const msg = await sendOrReply(message, {
                content: `❓ | Quelle action voulez-vous effectuer ?\n\n> \`ajouter\` pour ajouter un salon, \`retirer\` pour retirer un salon, ou \`lister\` pour lister les salons ${type.toLowerCase() === 'autorisés' ? 'autorisés' : 'interdits'}`
            }).catch(log4js.trace);
            if (!msg) return

            const response = await waitForMessage({
                channel: msg.channel as TextChannel,
                user: message.author,
                whoCanReply: 'useronly'
            }).catch(log4js.trace)

            if (response && response.deletable) response.delete().catch(log4js.trace)
            if (!response || response.content.toLowerCase() === 'cancel') {
                return msg.edit(`💡 | Annulé`).catch(log4js.trace)
            }

            if (!allowedActions.includes(response.content.toLowerCase())) return msg.edit(`❌ | L'action \`${response.content}\` n'est pas valide. Veuillez réessayer la commande.`).catch(log4js.trace)

            msg.delete().catch(log4js.trace)

            action = response.content.toLowerCase();
        }

        if (listActions.includes(action)) {
            const channels = configs[purifiedType === 'allowed' ? 'only_channels' : 'denied_channels'];
            const embed = mergeEmbeds(userEmbed(message.author), orangeEmbed())
                .setTitle(purifiedType === "allowed" ? "Salons autorisés" : "Salons interdits")
                .setDescription(channels.length > 0 ? channels.map(x => `<#${x}>`).join(', ') : `Aucun salon ${purifiedType === 'allowed' ? 'autorisé' : 'interdit'}.`)

            return sendOrReply(message, {
                embeds: [embed]
            }).catch(log4js.trace);
        }

        if (actionsAdd.includes(action)) {
            let channel = await findChannelInMessage(message, options.args.slice(3).join(' '), true)

            if (!channel || channel.type !== ChannelType.GuildText) {
                const msg = await sendOrReply(message, `❓ | Je n'ai pas trouvé de salon correspondant. Quel salon voulez-vous ajouter ?\n> Répondez dans le chat, et par \`cancel\` pour annuler`).catch(log4js.trace);
                if (!msg) return;

                const result = await waitForChannelMessage({
                    user: message.author,
                    guild: message.guild,
                    channel: message.channel as TextChannel,
                    deleteUserReply: true,
                    types: [ChannelType.GuildText],
                    whoCanReply: 'user'
                });
                console.log(result)

                if (result.endType === 'cancelled' || result.endType === 'timeout') return msg.edit(`💡 | Annulé`).catch(log4js.trace);
                if (!result || result.endType === "fail") return msg.edit(`❌ | Je n'ai pas trouvé de salon correspondant. Veuillez réessayer la commande.`).catch(log4js.trace);

                channel = result.value as TextChannel;

                msg.delete().catch(log4js.trace);
            }

            if (configs[purifiedType === 'allowed' ? 'only_channels' : 'denied_channels'].includes(channel.id)) {
                return sendOrReply(message, `❌ | Le salon <#${channel.id}> est déjà ${purifiedType === 'allowed' ? 'autorisé' : 'interdit'}.`).catch(log4js.trace);
            }

            const channels = purifiedType === 'allowed' ? configs.only_channels : configs.denied_channels;
            channels.push(channel.id);

            configurations.update(message.guildId, purifiedType === 'allowed' ? 'only_channels' : 'denied_channels', channels)

            sendOrReply(message, {
                content: `✅ | Le salon <#${channel.id}> a été ${purifiedType === 'allowed' ? 'autorisé' : 'interdit'}.`
            });
        }
        if (actionsRemove.includes(action)) {
            let channel = await findChannelInMessage(message, options.args.slice(3).join(' '), true)

            if (!channel || channel.type !== ChannelType.GuildText) {
                const msg = await sendOrReply(message, `❓ | Je n'ai pas trouvé de salon correspondant. Quel salon voulez-vous retirer ?\n> Répondez dans le chat, et par \`cancel\` pour annuler`).catch(log4js.trace);
                if (!msg) return

                const result = await waitForChannelMessage({
                    user: message.author,
                    guild: message.guild,
                    channel: msg.channel as TextChannel,
                    deleteUserReply: true,
                    types: [ChannelType.GuildText],
                });

                if (result.endType === 'cancelled' || result.endType === 'timeout') return msg.edit(`💡 | Annulé`).catch(log4js.trace);
                if (!result || result.endType === "fail") return msg.edit(`❌ | Je n'ai pas trouvé de salon correspondant. Veuillez réessayer la commande.`).catch(log4js.trace);

                channel = result.value as TextChannel;

                msg.delete().catch(log4js.trace);
            }

            if (!configs[purifiedType === 'allowed' ? 'only_channels' : 'denied_channels'].includes(channel.id)) {
                return sendOrReply(message, `❌ | Le salon <#${channel.id}> n'est pas ${purifiedType === 'allowed' ? 'autorisé' : 'interdit'}.`).catch(log4js.trace);
            }

            const channels = purifiedType === 'allowed' ? configs.only_channels : configs.denied_channels;
            configurations.update(message.guildId, purifiedType === 'allowed' ? 'only_channels' : 'denied_channels', channels.filter(x => x !== channel.id))

            sendOrReply(message, {
                content: `✅ | Le salon <#${channel.id}> a été retiré des salons ${purifiedType === 'allowed' ? 'autorisés' : 'interdits'}.`
            });
        }
    }
    if (['rôles', 'roles', 'r'].includes(group.toLowerCase())) {
        let type = options.second

        if (!type) {
            displayConfigs()
            return
        }

        const allowedSubcommands = ['autorisés', 'allowed', 'autorises', 'autorisé', 'autorise', 'a']
        const deniedSubcommands = ['interdits', 'denied', 'interdi', 'i']
        const validCommands = allowedSubcommands.concat(deniedSubcommands)

        if (!validCommands.includes(type.toLowerCase())) {
            const msg = await sendOrReply(message, {
                content: `❓ | La commande est invalide. Laquelle voulez-vous utiliser ?\n\nVoulez-vous configurer les rôles **autorisés** ou **interdits** ?\n> Répondez dans le chat, et par \`cancel\` pour annuler`
            }).catch(log4js.trace)
            if (!msg) return

            const response = await waitForMessage({
                channel: msg.channel as TextChannel,
                user: message.author,
                whoCanReply: 'useronly'
            }).catch(log4js.trace)

            if (response && response.deletable) response.delete().catch(log4js.trace)
            if (!response || response.content.toLowerCase() === 'cancel') {
                return msg.edit(`💡 | Annulé`).catch(log4js.trace)
            }

            if (!validCommands.includes(response.content.toLowerCase())) return msg.edit(`❌ | La commande \`${response.content}\` n'est pas valide. Veuillez réessayer la commande.`).catch(log4js.trace)
            
            msg.delete().catch(log4js.trace)

            type = response.content.toLowerCase()
        }
        const purifiedType = allowedSubcommands.includes(type.toLowerCase()) ? 'allowed' : 'denied';

        let action = options.args[2]?.toLowerCase()

        const actionsAdd = ['ajouter', 'add', 'ajouté', 'ajoute', 'a', 'push', 'append']
        const actionsRemove = ['retirer', 'supprimer', 'pop', 'r', 'retiré', 'supprime', 'retire', 'remove']
        const listActions = ['lister', 'list', 'l', 'show', 'voir']
        const allowedActions = actionsAdd.concat(actionsRemove).concat(listActions);
        
        if (!action) {
            const roles = configs[purifiedType === 'allowed' ? 'only_roles' : 'deny_roles'];
            const embed = mergeEmbeds(userEmbed(message.author), orangeEmbed())
                .setTitle(purifiedType === "allowed" ? "Rôles autorisés" : "Rôles interdits")
                .setDescription(roles.length > 0 ? roles.map(x => `<@&${x}>`).join(', ') : `Aucun rôle ${purifiedType === 'allowed' ? 'autorisé' : 'interdit'}.`)

            return sendOrReply(message, {
                embeds: [embed]
            }).catch(log4js.trace);
        }

        if (!allowedActions.includes(action)) {
            const msg = await sendOrReply(message, {
                content: `❓ | Quelle action voulez-vous effectuer ?\n\n> \`ajouter\` pour ajouter un rôle, \`retirer\` pour retirer un rôle, ou \`lister\` pour lister les rôles ${type.toLowerCase() === 'autorisés' ? 'autorisés' : 'interdits'}`
            }).catch(log4js.trace);
            if (!msg) return

            const response = await waitForMessage({
                channel: msg.channel as TextChannel,
                user: message.author,
                whoCanReply: 'useronly'
            }).catch(log4js.trace)

            if (response && response.deletable) response.delete().catch(log4js.trace)
            if (!response || response.content.toLowerCase() === 'cancel') {
                return msg.edit(`💡 | Annulé`).catch(log4js.trace)
            }

            if (!allowedActions.includes(response.content.toLowerCase())) return msg.edit(`❌ | L'action \`${response.content}\` n'est pas valide. Veuillez réessayer la commande.`).catch(log4js.trace)

            msg.delete().catch(log4js.trace)

            action = response.content.toLowerCase();
        }

        if (listActions.includes(action)) {
            const channels = configs[purifiedType === 'allowed' ? 'only_roles' : 'deny_roles'];
            const embed = mergeEmbeds(userEmbed(message.author), orangeEmbed())
                .setTitle(purifiedType === "allowed" ? "Rôles autorisés" : "Rôles interdits")
                .setDescription(channels.length > 0 ? channels.map(x => `<@&${x}>`).join(', ') : `Aucun rôle ${purifiedType === 'allowed' ? 'autorisé' : 'interdit'}.`)

            return sendOrReply(message, {
                embeds: [embed]
            }).catch(log4js.trace);
        }

        if (actionsAdd.includes(action)) {
            let role = await findRoleInMessage(message, options.args.slice(3).join(' '), true)

            if (!role) {
                const msg = await sendOrReply(message, `❓ | Je n'ai pas trouvé de rôle correspondant. Quel rôle voulez-vous ajouter ?\n> Répondez dans le chat, et par \`cancel\` pour annuler`).catch(log4js.trace);
                if (!msg) return;

                const result = await waitForRoleMessage({
                    user: message.author,
                    guild: message.guild,
                    channel: message.channel as TextChannel,
                    deleteUserReply: true,
                    whoCanReply: 'user',
                    conditions: ['noteveryone']
                });
                console.log(result)

                if (result.endType === 'cancelled' || result.endType === 'timeout') return msg.edit(`💡 | Annulé`).catch(log4js.trace);
                if (!result || result.endType === "fail") return msg.edit(`❌ | Je n'ai pas trouvé de rôle correspondant. Veuillez réessayer la commande.`).catch(log4js.trace);

                role = result.value;

                msg.delete().catch(log4js.trace);
            }

            if (configs[purifiedType === 'allowed' ? 'only_roles' : 'deny_roles'].includes(role.id)) {
                return sendOrReply(message, {
                    content: `❌ | Le rôle <@&${role.id}> est déjà ${purifiedType === 'allowed' ? 'autorisé' : 'interdit'}.`,
                    allowedMentions: { roles: [] }
                }).catch(log4js.trace);
            }

            const roles = purifiedType === 'allowed' ? configs.only_roles : configs.deny_roles;
            roles.push(role.id);

            configurations.update(message.guildId, purifiedType === 'allowed' ? 'only_roles' : 'deny_roles', roles)

            sendOrReply(message, {
                content: `✅ | Le rôle <@&${role.id}> a été ${purifiedType === 'allowed' ? 'autorisé' : 'interdit'}.`,
                allowedMentions: { roles: [] }
            }).catch(log4js.trace);
        }
        if (actionsRemove.includes(action)) {
            let role = await findRoleInMessage(message, options.args.slice(3).join(' '), true)

            if (!role) {
                const msg = await sendOrReply(message, `❓ | Je n'ai pas trouvé de rôle correspondant. Quel salon voulez-vous retirer ?\n> Répondez dans le chat, et par \`cancel\` pour annuler`).catch(log4js.trace);
                if (!msg) return

                const result = await waitForRoleMessage({
                    user: message.author,
                    guild: message.guild,
                    channel: msg.channel as TextChannel,
                    deleteUserReply: true,
                    conditions: ['noteveryone']
                });

                if (result.endType === 'cancelled' || result.endType === 'timeout') return msg.edit(`💡 | Annulé`).catch(log4js.trace);
                if (!result || result.endType === "fail") return msg.edit(`❌ | Je n'ai pas trouvé de rôle correspondant. Veuillez réessayer la commande.`).catch(log4js.trace);

                role = result.value;

                msg.delete().catch(log4js.trace);
            }

            if (!configs[purifiedType === 'allowed' ? 'only_roles' : 'deny_roles'].includes(role.id)) {
                return sendOrReply(message, `❌ | Le rôle <@&${role.id}> n'est pas ${purifiedType === 'allowed' ? 'autorisé' : 'interdit'}.`).catch(log4js.trace);
            }

            const channels = purifiedType === 'allowed' ? configs.only_roles : configs.deny_roles;
            configurations.update(message.guildId, purifiedType === 'allowed' ? 'only_roles' : 'deny_roles', channels.filter(x => x !== role.id))

            sendOrReply(message, {
                content: `✅ | Le rôle <@&${role.id}> a été retiré des rôles ${purifiedType === 'allowed' ? 'autorisés' : 'interdits'}.`,
                allowedMentions: { roles: [] }
            }).catch(log4js.trace);
        }
    }
})