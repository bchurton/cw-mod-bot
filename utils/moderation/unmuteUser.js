const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")
const config = require("../config.json")

module.exports = async (user, reason, moderator, guild, modmember) => {
    try {
        let components = []

        const member = await guild.members.fetch(user.id);
        if (!member) return [false, `Invalid member!`]
        if (!member.moderatable) return [false, `This user isn't unmutable! Make sure I have permission to unmute them.`]
        if (member.permissions.has("MANAGE_MESSAGES") || member.permissions.has("BAN_MEMBERS") || member.permissions.has("KICK_MEMBERS") || member.permissions.has("MODERATE_MEMBERS") || member.permissions.has("ADMINISTRATOR")) return [false, `You can't unmute another moderator!`]
        if (modmember.roles.highest.position <= member.roles.highest.position && moderator.id !== guild.ownerId)  return [false, `You can't unmute this user!`]
        if (!member.communicationDisabledUntil) return [false, `User isn't muted!`]
        let dmEmbed = new MessageEmbed()
            .setTitle(`You were unmuted in ${guild.name}`)
            .setDescription(`**Reason**: ${reason || `No reason provided`}`)
            .addField(`Moderator`, `${moderator.username}#${moderator.discriminator} (<@${moderator.id}>)`)
            .setColor("#E9CA1A")
            .setThumbnail(guild.iconURL({ dynamic:true, size:1024 }))

        await user.send({ embeds:[dmEmbed], components }).catch(() => { })
        await member.timeout(null)
        return [true]
    }
    catch (err) {
        return [false, err]
    }
}
