import { Event } from "djs-bot-base";

export default new Event({
  categoryName: "clientReady",
  run(client) {
    console.log(`${client.user.username} aktif!`);

    client.user.setPresence({
      status: "idle",
      activities: [{ name: "👾 Oyun oynuyor" }],
    });
  },
});
