const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")
const config = require("../config.json")

module.exports = async (user, reason, moderator, guild, modmember) => {
    try {
        let components = []

        const member = await guild.members.fetch(user.id);
        if (member) {
            if (!member.bannable) return [false, `This user isn't bannable! Make sure I have permission to ban them.`]
            if (modmember.roles.highest.position <= member.roles.highest.position && moderator.id !== guild.ownerId)  return [false, `You can't ban this user!`]
            if (member.permissions.has("MANAGE_MESSAGES") || member.permissions.has("BAN_MEMBERS") || member.permissions.has("KICK_MEMBERS") || member.permissions.has("MODERATE_MEMBERS") || member.permissions.has("ADMINISTRATOR")) return [false, `You can't ban another moderator!`]
        }
        
        if (user.id === moderator.id) return [false, `You can't ban yourself!`]

        let banDM = new MessageEmbed()
            .setTitle(`You were banned from ${guild.name}.`)
            .setDescription(`Reason: \`${reason}\``)
            .addField(`Moderator`, `${moderator.username}#${moderator.discriminator} (<@${moderator.id}>)`)
            .setColor("#CB1818")
        
        if (config.appealsLink) {
            const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel('Appeal Ban')
                    .setStyle('LINK')
                    .setURL(config.appealsLink),
            );
            components.push(row)
        }

        await user.send({ embeds:[banDM], components }).catch(() => { })
        await guild.bans.create(user, { reason }).catch((err) => { return [false, err] })
        return [true]
    }
    catch (err) {
        console.log(err)
        return [false, err]
    }
}