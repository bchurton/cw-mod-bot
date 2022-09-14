const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")
const config = require("../config.json")

module.exports = async (user, reason, moderator, guild, modmember, length) => {
    let components = []

    if (length > 2419200000) return [false, `The maximum mute length is 28 days!`]
    const member = await guild.members.fetch(user.id);
    if (!member) return [false, `Invalid member!`]
    if (!member.moderatable) return [false, `This user isn't mutable! Make sure I have permission to mute them.`]
    if (member.permissions.has("MANAGE_MESSAGES") || member.permissions.has("BAN_MEMBERS") || member.permissions.has("KICK_MEMBERS") || member.permissions.has("MODERATE_MEMBERS") || member.permissions.has("ADMINISTRATOR")) return [false, `You can't mute another moderator!`]
    if (modmember.roles.highest.position <= member.roles.highest.position && moderator.id !== guild.ownerId)  return [false, `You can't mute this user!`]

    let dmEmbed = new MessageEmbed()
        .setTitle(`You were muted in ${guild.name}`)
        .setDescription(`**Reason**: ${reason || `No reason provided`}\nUnmuted in: <t:${Math.round((Date.now() + Math.round(length))/1000)}:R>`)
        .addField(`Moderator`, `${moderator.username}#${moderator.discriminator} (<@${moderator.id}>)`)
        .setColor("#E9CA1A")
        .setThumbnail(guild.iconURL({ dynamic:true, size:1024 }))

    await user.send({ embeds:[dmEmbed], components }).catch(() => { })
    await member.timeout(Number(length))
    return [true]
}
