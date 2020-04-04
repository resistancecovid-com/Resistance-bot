
export default class CommandHandler {
    readonly commandMap: Map<string, any>;
    //Property todo: should be moved in a json file
    readonly prefix:string = '!';

    constructor() {
        this.commandMap = new Map();
    }


    addCommand(command: string, handler: Function) {
        if (command == undefined || command === '') return;
        console.log("command added: ", command);
        this.commandMap[this.prefix + command] = handler;
    }

    removeCommand(command = '') {
        if (command == undefined || command === '') return;
        delete this.commandMap[command];
    }

    handle(message) {
        this.commandMap.forEach((value, key) => {
            message.content.startsWith(key) ? this.commandMap[key](message): console.log(`Unknown command: ${message.content}`)
        })
    }




}
