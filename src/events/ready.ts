import { AmethystEvent, log4js } from "amethystjs"
import { ActivityType } from "discord.js"
import configs from "../database/models/configs"

export default new AmethystEvent('ready', async(client) => {
    client.user.setActivity({
        type: ActivityType.Playing,
        name: 'à Homeland'
    })

    const confs = await configs.findAll().catch(log4js.trace)
    if (!confs) {
        throw new Error("Configs not found")
    }

    confs.forEach((conf) => {
        client.prefixesManager.setPrefix({
            guildId: conf.dataValues.guild_id,
            prefix: conf.dataValues.prefix
        })
    })
})