import {Client} from 'discord.js'
import CommandHandler from "./CommandHandler";

export default class DiscordConnect {
    private token:string;
    private client: Client;
    private commands: CommandHandler;


    constructor(token: string, handler:CommandHandler) {
        this.token = token;
        this.client = new Client();
        this.commands = handler;

        console.log(handler);
    }

    connect() {
        this.client.on('ready', () => console.log('Resistance-bot connected to discord Server'));
        this.client.on('message', message => {
            if( !message.content.startsWith(this.commands.prefix)) return;


            console.log("Command Asked: ", this.commands.commandMap);
            for (const key in this.commands.commandMap) {
                console.log('key: ', key)
                if( message.content.startsWith(key)) {
                    console.log('pong');
                    this.commands.commandMap[key](message);
                }
            }
            this.commands.commandMap.forEach((value, key) => console.log('Hello'))

        });

        this.client.login(this.token);
    }
}
