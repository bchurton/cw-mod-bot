const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")

module.exports = {
    name: "feedback",
    description: "Send feedback modal!",
    async execute(client, message, args) {

        if (!message.member.permissions.has("MANAGE_MESSAGES"))  return await message.reply(`<:michael_error:1001860943380217906> You don't have permission to use this command!`)
        
        let embed = new MessageEmbed()
            .setTitle("Rate this Game Night!")
            .setDescription(`Thank you for participating in a Combat Warriors game night!\nTo make everyone's experience better, we'd like to ask for your honest feedback.\n\nRate your experience on a scale of 1-5. **You can only vote once!**\n\nThis feedback form expires <t:${Math.round(Date.now()/1000) + 43200}:R>`)
            .setColor("AQUA")
        
        let row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId(`1-${Date.now()}`)
                .setLabel('⭐')
                .setStyle(`SECONDARY`),
            
            new MessageButton()
                .setCustomId(`2-${Date.now()}`)
                .setLabel('⭐')
                .setStyle(`SECONDARY`),
            
            new MessageButton()
                .setCustomId(`3-${Date.now()}`)
                .setLabel('⭐')
                .setStyle(`SECONDARY`),

            new MessageButton()
                .setCustomId(`4-${Date.now()}`)
                .setLabel('⭐')
                .setStyle(`SECONDARY`),

            new MessageButton()
                .setCustomId(`5-${Date.now()}`)
                .setLabel('⭐')
                .setStyle(`SECONDARY`),

        )

        await message.channel.send({ embeds:[embed], components:[row] })
        await message.delete()
    }
}
