import {RichEmbed} from "discord.js";

export enum Embed {
    INFO = 0X0084FF, //BLUE
    ERROR = 0XFA3C4C, //RED
    WARNING = 0XFFC300, //ORANGE
    SYSTEM = 0X44BEC7 // LIGHT-BLUE
}


export function toEmbed(type:Embed, title:string, message:string) {
    return new RichEmbed()
        .setTitle(title)
        .setColor(type)
        .setDescription(message);
}
