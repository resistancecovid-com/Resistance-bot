import DiscordConnect from "./discord/DiscordConnect";
import CommandHandler from "./discord/CommandHandler";
import * as commands from "./discord/Command/commands";
import DiscordCommand from "./discord/DiscordCommand";


const discord = new DiscordConnect('MzUwNTUzNTg5NTk0MzI1MDAz.XotwkA.hNz5ku41QE_bFd2cuY4_ipR5-vg');

const handler = CommandHandler.instance;
handler.addCommand(DiscordCommand.of("ping", "pong!", commands.ping));
handler.addCommand(DiscordCommand.of("sources", "Show STL sources", commands.sources));
handler.addCommand(DiscordCommand.of("tutos", "Tuto from ResistanceCovid", commands.tutos));
handler.addCommand(DiscordCommand.of("recap", "Wiki link of important discussions summary", commands.recap));
handler.addCommand(DiscordCommand.of("stock", "Show all the business partner", commands.stock));
handler.addCommand(DiscordCommand.of("cellules", "View the available communication cells", commands.cells));
handler.addCommand(DiscordCommand.of("welcome", "I'm the bot", commands.welcome));
handler.addCommand(DiscordCommand.of("help", "Let me Help you", commands.help));
handler.addCommand(DiscordCommand.of("in-progress", "work in Progress!", commands.inProgress));
handler.addCommand(DiscordCommand.of("list", "list of all availlable commands", commands.list));

discord.attachHandler(handler);
discord.connect();
