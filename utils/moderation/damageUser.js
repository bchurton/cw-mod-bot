const { MessageEmbed } = require("discord.js")

const config = require("../config.json")
const { database } = require("../database")

const logBan = require("../logging/ban")
const logMute = require("../logging/mute")

const banUser = require("../moderation/banUser")
const muteUser = require("../moderation/muteUser")

module.exports = async (client, user, reason, moderator, guild, modMember, amount) => {
    try {
        if (!/^\d+$/.test(amount)) return [false, `Damage amount must be a whole number!`]
        const dbUser = await database.collection("damages").findOne({ userid: user.id })

        const damages = dbUser ? dbUser.damages : 0
        if (user.id === moderator.id) return [false, `You can't damage yourself!`]
        const member = await guild.members.fetch(user.id);
        if (member) {
            if (member.permissions.has("MANAGE_MESSAGES") || member.permissions.has("BAN_MEMBERS") || member.permissions.has("KICK_MEMBERS") || member.permissions.has("MODERATE_MEMBERS") || member.permissions.has("ADMINISTRATOR")) return [false, `You can't damage another moderator!`]
        }
        else {
            return [false, `That user isn't currently in this server!`]
        }

        var punishment = `N/A`
        var punished = false
        if (Number(damages)+Number(amount) === config.banDamage || damages+Number(amount) > config.banDamage) {
            await banUser(user, `Total damage exceeded ${config.banDamage}`, moderator, guild, modMember)
            await logBan(client, user, moderator, `Total damage exceeded ${config.banDamage}`)
            punishment = `have been banned`
            punished = true
        }
        else if (Number(amount) === config.muteDamage || Number(amount) > config.muteDamage) {
            await muteUser(user, `Total damage exceeded ${config.muteDamage}`, moderator, guild, modMember, 18000000)
            await logMute(client, user, moderator, `Total damage exceeded ${config.muteDamage}`, 18000000)
            punishment = `are now muted for 5 hours.`
            punished = true
        }

        let dmEmbed = new MessageEmbed()
            .setTitle(`You recieved ${amount} damage in ${guild.name}`)
            .setDescription(`**Reason**: ${reason || `No reason provided`}`)
            .addField(`Moderator`, `${moderator.username}#${moderator.discriminator} (<@${moderator.id}>)`)
            .addField(`Damage`, `\`Amount:\` ${amount}\n\`Total:\` ${damages+Number(amount)}`, true)
            .setColor("#EA7A17")
            .setThumbnail(guild.iconURL({ dynamic:true, size:1024 }))
        
        await user.send({ embeds:[dmEmbed] }).catch(() => { })

        dbUser ? await database.collection("damages").updateOne({ userid:user.id }, { $set:{ damages: damages+Number(amount) } }) : await database.collection("damages").insertOne({ userid:user.id, damages })
        return [true, damages+Number(amount), punished, punishment]

    }
    catch (err) {
        return [false, err]
    }

}