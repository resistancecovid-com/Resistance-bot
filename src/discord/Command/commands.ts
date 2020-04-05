import * as fs from 'fs';
import CommandHandler from "../CommandHandler";
import {Message} from "discord.js";

export const list = (message) => {
    const padding = 10;
    const toSend = ["```List of all commands:\n", "command".padEnd(padding, " "), "\tdescription\n"];
    CommandHandler.instance.commandList
        .map(element => `${element.name.padEnd(padding, " ")}\t${element.description}\n`)
        .forEach(elem => toSend.push(elem));
    toSend.push("```");
    message.channel.send(toSend.join(""));
};

export const ping = (message) => message.channel.send('pong');
export const sources = (message) => message.channel.send(fs.readFileSync("resources/stl-sources.md", "utf8"));
export const tutos = (message) => message.channel.send(fs.readFileSync("resources/tutos.md", "utf8"));
export const stock = (message) => message.channel.send(fs.readFileSync("resources/stock.md", "utf8"));
export const recap = (message) => message.channel.send('https://wiki.resistancecovid.com/doku.php?id=synthese-discutions');

export const inprogress = (message) => message.channel.send(`Liste des projets en cours : 
            <#${retrieveChannelId(message, 'respirateur')}> ,
            <#${retrieveChannelId(message, 'manifeste')}>,
            <#${retrieveChannelId(message, 'devtools')}>,
            <#${retrieveChannelId(message, 'faceshieldev')}>`
);

export const cells = (message) => {message.channel.send(replacePlaceHolderWithChannelId(message, fs.readFileSync("resources/tutos.md", "utf8")));
};

export const welcome = (message) => {message.channel.send(replacePlaceHolderWithChannelId(message, fs.readFileSync("resources/welcome.md", "utf8")))};
//
// export const thing = (message) => {
//     var context = message.content;
//     var ticker = context.substring(7);
//     var initializePromise = gethingerverse(ticker);
//     initializePromise.then(function (result) {
//         if (result[0] || result.error != "not_authorized") {
//             var things = result;
//             channel1.send("Il y a ** " + things.length + " paterns ** sur thingerverse pour ta recherche sur " + ticker);
//
//         }
//         if (context.length > 7) {
//             things.forEach((value, key, thisMap) => {
//                 message.author.send("Derniers pattern sorti sur thinngerverse ** " + value.name + "  **  source : " + value.public_url);
//             })
//         } else {
//             channel1.send("[API]Il y a pas de result");
//
//         }
//
//     }, function (err) {
//         console.log(err);
//     })
//
// }


export const help = (message) => message.channel.send('Welcome voici le bot de monitoring de Resistancecovid \n Fonctions : **! fonctions** ');

export function replacePlaceHolderWithChannelId(message:Message, text:string ) {
    let regex =  /\{[a-zA-Z1-9_]+}/g, matches;
    while( (matches = regex.exec(text)) != null) {
        text.replace('${'+matches[0]+'}', retrieveChannelId(message, matches[0]));
    }
}

function retrieveChannelId(message: Message, name: string):string {
    return "1";
    // return message.guild.channels.find(channel => channel.name === name).id;
}

function sendFileToChannel(message: Message, fileUrl: string) {
    message.channel.send(fs.readFileSync(fileUrl, "utf8"))
}
