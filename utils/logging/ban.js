const { MessageEmbed } = require("discord.js")

const config = require("../config.json")
const { database } = require("../database")

module.exports = async (client, user, moderator, reason) => {

    let logEmbed = new MessageEmbed()
        .setTitle(`${moderator.username} banned ${user.username}`)
        .setDescription(`**Reason**: ${reason}`)
        .addField(`Moderator`, `${moderator.username}#${moderator.discriminator} (<@${moderator.id}>)`)
        .setThumbnail(user.displayAvatarURL({ dynamic:true, size:1024 }))
        .setColor("#5454a4")
        .setFooter({ text:`User ID: ${user.id}` })

    const channel = await client.channels.cache.get(config.ban_logs);
    await channel.send({ embeds:[logEmbed] })
    
    await database.collection("moderations").insertOne({ userid:user.id, moderator:moderator.id, reason, punishment:"ban", dateTime:Date.now() })
}