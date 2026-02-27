import "dotenv/config";

import { CommandHandler, EventHandler } from "djs-bot-base";
import { Client, Partials } from "discord.js";

const commands = new CommandHandler({
  commandsDir: "src/commands",
  slashCommandsDir: "src/slashCommands",
  prefix: "!",
  suppressWarnings: true,
});

const events = new EventHandler({
  eventsDir: "src/events",
  suppressWarnings: true,
});

const client = new Client({
  intents: ["MessageContent", "GuildMessages", "Guilds"],
  partials: [Partials.User, Partials.Channel, Partials.Message],
});

void (async () => {
  await commands.setCommands();
  await commands.setSlashCommands();
  // @ts-expect-error it is a bug
  await events.setEvents(client);
  // @ts-expect-error it is a bug
  commands.setDefaultHandler(client).setDefaultSlashHandler(client);
  await client.login(process.env["TOKEN"]);
  // @ts-expect-error it is a bug
  await commands.registerSlashCommands(client);
})();

// test
