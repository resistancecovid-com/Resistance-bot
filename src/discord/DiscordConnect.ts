import {Client} from 'discord.js'
import CommandHandler from "./CommandHandler";

export default class DiscordConnect {
    private token:string;
    private client: Client;
    private commands: CommandHandler;

    constructor(token: string) {
        this.token = token;
        this.client = new Client();
    }

    connect() {
        this.client.on('ready', () => console.log('Resistance-bot connected to discord Server'));
        this.client.on('message', this.messageHandler);

        this.client.login(this.token);
        console.log("Ready to serve !")
    }

    attachHandler(handler: CommandHandler) {
        if( this.commands != undefined) return;
        this.commands = handler;
    }


    messageHandler = (message) => {
        if( !message.content.startsWith(this.commands.prefix)) return;
        this.commands.handle(message);
    }
}
