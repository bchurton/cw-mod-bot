const { MessageEmbed } = require("discord.js")

const config = require("../config.json")
const { database } = require("../database")

module.exports = async (client, user, moderator, reason, length) => {

    let logEmbed = new MessageEmbed()
        .setTitle(`${moderator.username}#${moderator.discriminator} muted ${user.username}#${user.discriminator}`)
        .setDescription(`**Reason**: ${reason}\nUnmuted in: <t:${Math.round((Date.now() + Math.round(length))/1000)}:R>`)
        .addField(`Moderator`, `${moderator.username}#${moderator.discriminator} (<@${moderator.id}>)`)
        .setThumbnail(user.displayAvatarURL({ dynamic:true, size:1024 }))
        .setColor("#5454a4")
        .setFooter({ text:`User ID: ${user.id}` })

    const channel = await client.channels.cache.get(config.mute_logs);
    await channel.send({ embeds:[logEmbed] })
    
    await database.collection("moderations").insertOne({ userid:user.id, moderator:moderator.id, reason, punishment:"mute", muteLength:length, dateTime:Date.now() })
}