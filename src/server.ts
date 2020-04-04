import DiscordConnect from "./discord/DiscordConnect";
import CommandHandler from "./discord/CommandHandler";
import * as commands from "./discord/Command/commands";

const handler = new CommandHandler();
handler.addCommand("ping", commands.ping);

const discord = new DiscordConnect('MzUwNTUzNTg5NTk0MzI1MDAz.XofBkw.8jO1MEamJkF7o55shIIgIJ9mGig', handler);



discord.connect();
