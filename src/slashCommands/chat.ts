import { SlashCommand } from "djs-bot-base";
import { chats } from "../handlers.ts";
import { MessageFlags } from "discord.js";

export default new SlashCommand({
  slashCommandData: (command) =>
    command
      .setName("chat")
      .setDescription("Change chat settings")
      .addSubcommand((clear) =>
        clear.setName("clear").setDescription("Clears user's chat history"),
      ),
  async run(interaction) {
    const subcommand = interaction.options.getSubcommand();

    if (!subcommand) return;

    switch (subcommand) {
      case "clear": {
        chats.deleteKey(interaction.user.id);
        await interaction.reply({
          content: "Sohbetiniz başarıyla silindi.",
          flags: MessageFlags.Ephemeral,
        });
        return;
      }
    }
  },
});
