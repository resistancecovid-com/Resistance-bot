import CommandHandler from "../CommandHandler";
import {Embed, toEmbed} from "../embed/Embed";
import {RichEmbed} from "discord.js";

export const list = (message) => {
    let padding = 12;
    message.channel.send( "```List of all commands:\ncommand\t\tdescription\n"
            .concat(CommandHandler.instance.commandList
                .map(element => `${element.name.padEnd(padding)}\t${element.description}\n`)
                .join(""))
            .concat("```"));
};

export const ping = (message) => message.channel.send('pong');
export const sources = (message) => message.sendEmbedFile(Embed.INFO, "Sources Stl", "resources/stl-sources.md");
export const tutos = (message) => message.sendEmbedFile(Embed.INFO, "Tutoriels", "resources/tutos.md");
export const stock = (message) => message.sendEmbedFile(Embed.INFO, "Stocks", "resources/stock.md");
export const recap = (message) => message.sendEmbedText(Embed.INFO, "Récapitulatif", "https://wiki.resistancecovid.com/doku.php?id=synthese-discutions");
export const cells = (message) => message.sendEmbedFile(Embed.INFO, "Cellules", "resources/tutos.md");
export const welcome = (message) => message.sendEmbedFile(Embed.INFO, "Welcome", "resources/welcome.md");
export const help = (message) => message.sendEmbedText(Embed.INFO, "Help", 'Welcome voici le bot de monitoring de Resistancecovid \n Fonctions : **!list** ');
export const inProgress = (message) => message.sendEmbedFile(Embed.INFO, "","resources/in-progress.md");

