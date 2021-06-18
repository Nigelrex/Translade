const Discord = require("discord.js");
const client = new Discord.Client({
  ws: {
    intents: Discord.Intents.ALL,
  },
  partials: ["MESSAGE", "REACTION", "CHANNEL", "GUILD_MEMBER", "USER"],
  restTimeOffset: 0, // magically makes reacting faster
});
client.commands = new Discord.Collection();
module.exports.client = client;
const dotenv = require("dotenv").config();
const config = require("./config.json");
const translate = require("@vitalets/google-translate-api");
const keepAlive = require("./server");

client.once("ready", () => {
  client.user.setPresence({
    activity: { name: "Messages", type: "WATCHING" },
    status: "dnd",
  });
  console.log("Translade is Online!\n\n");
  process.on("unhandledRejection", (error) => {
    console.error("Unhandled promise rejection:", error);
  });
});

client.on("message", (message, args) => {
  if (message.content.startsWith(`${config.bot.prefix}help`)) {
    message.reply({
      embed: {
        title: "Help?",
        description:
          "Translade is a bot, it can translate your messages in any official languages in the world!",
        fields: [
          {
            name: "Prefix",
            value: `${config.bot.prefix}`,
            inline: true,
          },
          {
            name: "Help",
            value: `Ping me or use ${config.bot.prefix}help`,
            inline: true,
          },
          {
            name: "Usage",
            value: `t!ts <message> <lang>`,
            inline: true,
          },
        ],
        image: {
          url: 'https://i.imgur.com/CPenYbI.gif',
        },
        footer: { text: "- By Translade" },
        color: config.bot.color,
      },
    });
  }
});

client.on("message", (message, args) => {
  if (message.mentions.users.has(client.user.id) && !message.author.bot) {
    message.reply({
      embed: {
        title: "Help?",
        description:
          "Translade is a bot, it can translate your messages in any official languages in the world!",
        fields: [
          {
            name: "Prefix",
            value: `${config.bot.prefix}`,
            inline: true,
          },
          {
            name: "Help",
            value: `Ping me or use ${config.bot.prefix}help`,
            inline: true,
          },
          {
            name: "Usage",
            value: `t!ts <message> <lang>`,
            inline: true,
          },
        ],
        image: {
          url: "https://i.imgur.com/CPenYbI.gif",
        },
        footer: { text: "- By Translade" },
        color: config.bot.color,
      },
    });
  }
});

client.on("message", async (message, args) => {
  if (message.content.startsWith(`${config.bot.prefix}ts `)) {
    const args = message.content
      .slice(config.bot.prefix.length + 2)
      .trim()
      .split(/ +/g);
    //console.log(args);
    let lang = args.pop(); //language(last word)
    //console.log(lang);
    const tmsg = args.join(" "); //rest of the words
    //console.log(tmsg);
    translate(tmsg, { to: lang }).then((res) => {
      const tldmsg = res.text;
      if (args === 0) {
        message.reply({
          embed: {
            title: "ERROR",
            description: "You didn't provide a message to translate",
          },
        });
      } else {
        message.reply({
          embed: {
            title: "Translated message",
            description: `${tldmsg}`,
            fields: [{ name: "Translated to", value: `**Language: **${lang}` }],
            footer: {
              text: `Requested by ${message.author.username}`,
            },
            color: config.bot.color,
          },
        });
      }
      //console.log(res.text); //translated language
      //console.log(res.from.language.iso); //language converted
    });
    // .catch((err) => {
    //   message.channel.send({ embed: { title: "ERROR", description: err } });
    //   //console.error(err);
    // });
  }
});

keepAlive();
client.login(process.env.bottoken);
