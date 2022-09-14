const config = require("../utils/config.json")
const { MessageEmbed } = require("discord.js")
const { database } = require("../utils/database")

module.exports = {
    name: "modalSubmit",
    async execute(client, modal) {
        try {
            await modal.deferReply({ ephemeral:true })
            var channel = await client.channels.cache.get(config.feedback_logs);
            const comments = modal.getTextInputValue('feedback');
            let embed = new MessageEmbed()
                .setTitle("New game night feedback!")
                .setDescription(`Voted: ${`⭐`.repeat(Number(modal.customId.split("-")[0]))}`)
                .setColor("#5454a4")
                .addField(`User`, `${modal.user.username}#${modal.user.discriminator} (<@${modal.user.id}>)`)
                .addField(`Feedback`, comments || `No feedback provided!`)
            await channel.send({ embeds:[embed] })

            await modal.editReply({ content:`Thank you for rating Game Night!`, ephemeral:true })

            await database.collection("gamenightfeedback").insertOne({ user:modal.user.id, msg:modal.customId.split("-")[1] })
        }
        catch (err) {
            console.log(err)
        }
    }
}