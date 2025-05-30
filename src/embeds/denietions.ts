import { User } from "discord.js";
import { mergeEmbeds, redEmbed, userEmbed } from "./base";

export const notStarted = (user: User) => mergeEmbeds(userEmbed(user), redEmbed()).setTitle("Aventure non commencée").setDescription("Vous n'avez pas encore commencé le jeu")
export const guildOnly = (user: User) => mergeEmbeds(userEmbed(user),  redEmbed()).setTitle("Action impossible").setDescription("Cette commande n'est disponible que dans un serveur")
export const underCooldown = (user: User, seconds: number) => mergeEmbeds(userEmbed(user), redEmbed()).setTitle("Cooldown").setDescription(`Veuillez patienter **${Math.ceil(seconds)}** avant de pouvoir réutiliser cette commande`)
export const started = (user: User) => mergeEmbeds(userEmbed(user), redEmbed()).setTitle("Aventure commencée").setDescription("Vous avez déjà commencé l'aventure, vous pouvez continuer à jouer !")