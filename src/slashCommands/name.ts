import { PermissionFlagsBits } from "discord.js";
import { SlashCommand } from "djs-bot-base";

export default new SlashCommand({
  slashCommandData: (command) =>
    command
      .setName("name")
      .setDescription("Manage user names")
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
      .addSubcommand((set) =>
        set
          .setName("set")
          .setDescription("Sets given user's name")
          .addUserOption((user) =>
            user.setName("user").setDescription("The user to set"),
          ),
      )
      .addSubcommand((clear) =>
        clear
          .setName("clear")
          .setDescription("Clears given user's name")
          .addUserOption((user) =>
            user.setName("user").setDescription("The user to clear"),
          ),
      ),
  run() {
    // TODO: Complete
    return;
  },
});
