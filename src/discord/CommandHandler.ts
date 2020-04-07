import DiscordCommand from "./DiscordCommand";
import {Embed, toEmbed} from "./embed/Embed";

export default class CommandHandler {
    private static INSTANCE: CommandHandler;

    readonly commandList: Array<DiscordCommand>;
    //Property todo: should be move in a json file
    readonly prefix:string = '!';

    private constructor() {
        this.commandList = new Array();
    }

    public static get instance() {
        return this.INSTANCE || (this.INSTANCE = new this())
    }

    addCommand(command:DiscordCommand) {
        if (command == undefined) return;
        console.log("command added: ", command.name);
        this.commandList.push(command);
    }

    handle(message) {
        const command = this.commandList.find(value => message.content.startsWith(this.prefix + value.name));
        command != undefined ? command.callback(message, this) : toEmbed(Embed.ERROR, "Error-404", "Command not found");
    }





}
