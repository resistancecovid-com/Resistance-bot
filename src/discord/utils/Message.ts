import {Collection, GuildChannel, Message, Snowflake} from "discord.js";
import * as fs from "fs";
import {Embed, toEmbed} from "../embed/Embed";

declare module 'discord.js' {
    interface Message {
        sendEmbedFile(type: Embed , title:string, filePath:string):Promise<Message | Message[]>,
        sendEmbedText(type: Embed, title:string, text:string):Promise<Message | Message[]>
    }
}

Message.prototype.sendEmbedFile = function(type: Embed, title, filePath) {
    console.log("I'm here: ", fs.readFileSync(filePath, "utf8"));
    return this.channel.send(toEmbed(type, title, replacePlaceHolderByChannelId(this.guild.channels, fs.readFileSync(filePath, "utf8"))));
};

Message.prototype.sendEmbedText = function(type: Embed, title, text) {
    console.log("I'm here");
    return this.channel.send(toEmbed(type, title, text))};



export function replacePlaceHolderByChannelId(channels:Collection<Snowflake, GuildChannel>, text ) {
    return /\$\{\S+}/g.test(text) ? text.match(/\$\{\S+}/g).map(match => text = text.replace(match, retrieveChannelId(channels, match.replace(/(\$\{|\})/g, "")))).pop() : text;
}

export function retrieveChannelId(channels: Collection<Snowflake, GuildChannel>, name):string {
    return channels.find(channel => channel.name === name).id;
}
