import { AmethystEvent, commandDeniedCode } from "amethystjs";
import { sendOrReplyRemove } from "../utils/toolbox";
import { guildOnly, underCooldown } from "../embeds/denietions";

export default new AmethystEvent("commandDenied", async(command, reason) => {
    if (command.type !== "message") return;

    if (reason.metadata?.silent) return;
    if (reason.code === commandDeniedCode.GuildOnly) return sendOrReplyRemove(command.message, { embeds: [guildOnly(command.user)] }, 5000)
    if (reason.code === commandDeniedCode.UnderCooldown) return sendOrReplyRemove(command.message, { embeds: [underCooldown(command.user, reason.metadata.remainingCooldownTime / 1000)] }, 5000)
})