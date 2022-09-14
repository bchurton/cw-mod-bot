const { Client, Intents, Collection, } = require("discord.js");
const fs = require('fs');
const chalk = require("chalk")
const config = require("./utils/config.json")
const { connect } = require("./utils/database")
const discordModals = require('discord-modals')

const intents = new Intents();
intents.add(
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_BANS,
    Intents.FLAGS.DIRECT_MESSAGES
);

const client = new Client({
    intents: intents, partials: ["MESSAGE", "REACTION", "CHANNEL"],
    allowedMentions: { parse: ["users"] }
});
discordModals(client)

client.commands = new Collection()

client.on("ready", async () => {
    console.log(chalk.green(`Ready! ${new Date(Date.now())}`))
    await connect()
});

console.log(chalk.red("LOADING COMMANDS..."))
for (file of fs.readdirSync("./commands").filter(f => f.endsWith(".js"))) {
    const cmd = require(`./commands/${file}`);
    client.commands.set(cmd.name, cmd)
    console.log(chalk.green(`Loaded ${cmd.name}`))
}

console.log(chalk.red("\n\nLOADING EVENTS..."))
for (file of fs.readdirSync("./events").filter(f => f.endsWith(".js"))) {
    const event = require(`./events/${file}`);
    client.on(event.name, (...args) => event.execute(client, ...args))
    console.log(chalk.green(`Loaded ${event.name}`))
}

process.on('unhandledRejection', error => {
    chalk.red(error);
});

client.on("messageCreate", async (message) => {
    if (message.author.bot) return
    if (!message.content.startsWith("<@" + client.user.id + ">") && !message.content.startsWith("<@!" + client.user.id + ">") && !message.content.startsWith(config.prefix)) { return }
    let split = message.content.split(" ");
    let search = split[1]
    if (message.content.startsWith(config.prefix)) search = split[0].slice(config.prefix.length)
    let command = client.commands.get(search) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(search));
    let i = 1;
    if (message.content.startsWith(config.prefix)) i++;
    while (i <= 2) {
        i++;
        split.shift();
    };
    await command.execute(client, message, split).catch(() => {})
});

client.login(config.token);
