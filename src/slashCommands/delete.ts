import { InteractionContextType, MessageFlags } from "discord.js";
import { SlashCommand } from "djs-bot-base";

export default new SlashCommand({
  developerOnly: true,
  slashCommandData: (data) =>
    data
      .setName("delete")
      .setDescription("Deletes messages")
      .setContexts(InteractionContextType.Guild)
      .addNumberOption((opt) =>
        opt
          .setName("count")
          .setDescription("Sets the deletion count")
          .setRequired(true)
          .setMinValue(1)
          .setMaxValue(100),
      )
      .addUserOption((user) =>
        user
          .setName("user")
          .setDescription("User to delete messages")
          .setRequired(false),
      ),
  async run(interaction) {
    const count = interaction.options.getNumber("count", true);
    const user = interaction.options.getUser("user");

    const isGuildChannel =
      interaction.channel?.isTextBased() && "guild" in interaction.channel;

    if (!isGuildChannel) {
      void interaction.reply({
        content: "Bir hata oluştu",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const lastMessages = await interaction.channel.messages.fetch();
    const messages = Array.from(
      lastMessages.filter((msg) => !user || msg.author.id === user.id).values(),
    ).slice(0, count);

    const deletedMessages = await interaction.channel.bulkDelete(messages);

    await interaction.followUp({
      content: `**${deletedMessages.size.toString()}** message deleted${user ? ` from ${user.toString()}` : "."}`,
      flags: MessageFlags.Ephemeral,
      options: {
        allowedMentions: { parse: [] },
      },
    });
  },
});
