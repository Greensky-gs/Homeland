import { AmethystCommand, log4js, preconditions } from "amethystjs";
import notStarted from "../../preconditions/notStarted";
import { ApplicationCommandOptionType, Message } from "discord.js";
import { sendOrReply, waitForReaction } from "../../utils/toolbox";
import { getEmoji, getText } from "../../utils/getters";
import { players } from "../../cache/players";

export default new AmethystCommand({
    name: "start",
    description: "Commence votre aventure",
    aliases: ["commencer", "démarrer", "demarrer"],
    preconditions: [preconditions.GuildOnly, notStarted],
    options: [
        {
            name: "nom",
            description: "Votre nom d'aventurier (ne peut pas dépasser 30 caractères)",
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ]
}).setMessageRun(async({ message, client, options }) => {
    const name = options.args.join(' ')
    if (!name) return sendOrReply(message, `${getEmoji("star")} Tu n'as pas précisé ton nom`).catch(log4js.trace)

    const msg = await sendOrReply(message, `${getEmoji("star")} Tu commences ton aventure avec le nom **${name.slice(0, 30)}**, c'est bien celà?`).catch(log4js.trace) as Message<boolean>
    if (!msg) return;

    const reaction = await waitForReaction({
        message: msg,
        removeEmojisOnEnd: true,
        user: message.author
    })
    if (reaction.endType === 'timeout' || reaction.emoji.index === 1) return msg.edit(`❌ | Annulé`).catch(log4js.trace)

    const player = await players.create({
        id: message.author.id,
        name: name.slice(0, 30)
    }).catch(log4js.trace);

    if (!player) return msg.edit(`${getEmoji("star")} Une erreur est survenue lors de la création de votre personnage.`).catch(log4js.trace);

    msg.edit(`${getEmoji('star')} Bienvenue dans l'aventure, **${player.name}**`).catch(log4js.trace);

    setTimeout(() => {
        msg.reply({
            content: `${getEmoji('star')} \`\`\`${getText('start')}\`\`\``,
            allowedMentions: { repliedUser: false}
        }).catch(log4js.trace)
    }, 3000)
})