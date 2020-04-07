import CommandHandler from "./CommandHandler";
import {Message} from "discord.js";

export default class DiscordCommand implements Command{
    readonly name:string;
    readonly description:string;
    readonly callback:Function;


    static of(name:string, description:string, callback: Function) {
        return new DiscordCommand(name, description, callback);
    }

    constructor(name, description, callback) {
        this.name = name;
        this.description = description;
        this.callback = callback;
    }
}
