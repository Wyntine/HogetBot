import { InteractionContextType, MessageFlags } from "discord.js";
import { SlashCommand } from "djs-bot-base";

export default new SlashCommand({
  developerOnly: true,
  slashCommandData: (data) =>
    data
      .setName("send")
      .setDescription("Sends given message as the bot")
      .setContexts(InteractionContextType.Guild)
      .addStringOption((opt) =>
        opt
          .setName("message")
          .setDescription("Sets the message")
          .setRequired(true),
      )
      .addStringOption((opt) =>
        opt
          .setName("replied-to")
          .setDescription("Sets the message id which the bots replies to")
          .setRequired(false),
      ),
  async run(interaction) {
    const message = interaction.options.getString("message", true);
    const repliedTo = interaction.options.getString("replied-to", false);
    const isSendable = interaction.channel?.isSendable();

    if (!isSendable) {
      return interaction.reply({
        content: "Bir metin kanalında bulunduğunuzdan emin olun",
        flags: MessageFlags.Ephemeral,
      });
    }

    let replyOptions = {};

    if (repliedTo !== null) {
      const repliedMessage = await interaction.channel.messages
        .fetch(repliedTo)
        .catch(() => undefined);

      if (!repliedMessage) {
        return interaction.reply({
          content: "Aranılan mesaj bulunamadı",
          flags: MessageFlags.Ephemeral,
        });
      }

      replyOptions = { reply: { messageReference: repliedMessage } };
    }

    try {
      await interaction
        .deferReply({ flags: MessageFlags.Ephemeral })
        .catch(() => undefined);
      await interaction.deleteReply().catch(() => undefined);
      // eslint-disable-next-line no-empty
    } catch {}

    return interaction.channel.send({ content: message, ...replyOptions });
  },
});
