import { EmbedBuilder, User } from "discord.js";

export const baseEmbed = () => new EmbedBuilder().setTimestamp()
export const userEmbed = (user: User) => baseEmbed().setFooter({ text: user.username, iconURL: user.displayAvatarURL() })

export const redEmbed = () => baseEmbed().setColor('#ff0000')
export const greenEmbed = () => baseEmbed().setColor('#00ff00')
export const blueEmbed = () => baseEmbed().setColor('#0000ff')
export const orangeEmbed = () => baseEmbed().setColor('Orange')
export const randomColorEmbed = () => baseEmbed().setColor('Random')


export const mergeEmbeds = (...embeds: EmbedBuilder[]) => {
    let embedData = {};
    embeds.forEach((x) => {
        for (const key in x.data) {
            if (!!x.data[key]) embedData[key] = x.data[key];
        }
    });

    return new EmbedBuilder(embedData);
};
