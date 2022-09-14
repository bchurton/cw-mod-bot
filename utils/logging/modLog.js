const { MessageEmbed } = require("discord.js")

const config = require("../config.json")

module.exports = async (client, punishment, user, moderator, reason) => {
    try {

        let logEmbed = new MessageEmbed()
            .setTitle(`${punishment.charAt(0).toUpperCase() + punishment.slice(1)}`)
            .addField(`User`,`${user.username}#${user.discriminator} (<@${user.id}>)`,  true)
            .addField(`Moderator`,`${moderator.username}#${moderator.discriminator} (<@${moderator.id}>)`,  true)
            .addField(`Reason`, reason || `None provided`)
            .setColor(`#${punishment === "ban" ? `B53737` : punishment === "kick" ? `FF6D0A` : punishment === "unban" ? `00FF00` : `FFC0CB`}`)
        
        const channel = await client.channels.cache.get(config.mod_logs);
        await channel.send({ embeds:[logEmbed] })
        
    }
    catch (err) {
        console.log(err)
    }   
}