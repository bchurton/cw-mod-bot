const { MessageEmbed } = require("discord.js")

const config = require("../config.json")
const { database } = require("../database")

module.exports = async (client, amount, totalDamage, user, moderator, reason) => {
    try {
        let logEmbed = new MessageEmbed()
            .setTitle(`${user.username}#${user.discriminator} recieved ${amount} damage`)
            .setDescription(`**Reason**: ${reason}`)
            .addField(`Moderator`, `${moderator.username}#${moderator.discriminator} (<@${moderator.id}>)`)
            .addField(`Damage`, `\`Amount:\` ${amount}\n\`Total:\` ${totalDamage}`)
            .setThumbnail(user.displayAvatarURL({ dynamic:true, size:1024 }))
            .setColor("#5454a4")
            .setFooter({ text:`User ID: ${user.id}` })
        
        const channel = await client.channels.cache.get(config.damage_logs);
        await channel.send({ embeds:[logEmbed] })
        
        await database.collection("moderations").insertOne({ userid:user.id, moderator:moderator.id, reason, punishment:"damage", damageAmount:amount, dateTime:Date.now() })
    }
    catch (err) {
        console.log(err)
    }   
}