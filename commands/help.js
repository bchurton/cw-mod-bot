const { MessageEmbed, Message } = require("discord.js")
const { database } = require("../utils/database")

module.exports = {
    name: "help",
    description: "This command!",
    async execute(client, message, args) {
        
        let embed = new MessageEmbed()
            .setTitle(`${client.user.username} Commands`)
            .setDescription(client.commands.map(command => `\`;${command.name}\`\n<:patriciadown:1002588535645282325> *${command.description}*\n`).join("\n"))
            .setColor("AQUA")
        await message.channel.send({ embeds:[embed] })

    }
}

