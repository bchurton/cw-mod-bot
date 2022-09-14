const { MessageEmbed, Message } = require("discord.js")
const { database } = require("../utils/database")

module.exports = {
    name: "audits",
    description: "Get audit logs!",
    aliases:["stats", "ms", "modstats"],
    async execute(client, message, args) {
        try {

            if (!args[0]) {
                var user = message.author
            }
            else {
                const userMatches = args[0].replace("<", "").replace("@", "").replace("!", "").replace(">", "")
                if (!userMatches) return await message.reply(`<:michael_error:1001860943380217906> You haven't provided a valid user to check stats for!`)

                var user = await client.users.fetch(userMatches)

                if (!user) return await message.reply(`<:michael_error:1001860943380217906> Invalid user provided!`)
            }

            const msg = await message.channel.send(`Fetching moderations...`)

            let bans = []
            //let kicks = []
            let damages = []
            let mutes = []
            let totalDamage = 0
            let latestDamage = 0
            let latestMute = 0
            let latestBan = 0

            const allModerations = await database.collection("moderations").find({ moderator:user.id }).toArray()

            await Promise.all(allModerations.map(moderation => {
                if (moderation.punishment === "ban") {
                    bans.push(moderation)
                    if (moderation.dateTime > latestBan) latestBan = moderation.dateTime
                }
                //else if (moderation.punishment === "kick") {
                    //kicks.push(moderation)
                //}
                else if (moderation.punishment === "damage") {
                    damages.push(moderation)
                    totalDamage += Number(moderation.damageAmount)
                    if (moderation.dateTime > latestDamage) latestDamage = moderation.dateTime
                }
                else if (moderation.punishment === "mute" || moderation.punishment === "timeout") {
                    mutes.push(moderation)
                    if (moderation.dateTime > latestMute) latestMute = moderation.dateTime
                }
            }))

            let embed = new MessageEmbed()
                .setTitle(`${user.username}'s Moderation Statistics`)
                .setDescription(`Total moderations: ${damages.length + mutes.length + bans.length}`)
                .addField(`Damage Information`, `\`Damages issued:\` ${damages.length}\n\`Total damage:\` ${totalDamage}\n\`Latest damage issued:\` ${latestDamage !== 0 ? `<t:${Math.round(latestDamage/1000)}:f> (<t:${Math.round(latestDamage/1000)}:R>)` : `N/A`}`)
                .addField(`Mute Information`, `\`Mutes issued:\` ${mutes.length}\n\`Latest mute issued:\` ${latestMute !== 0 ? `<t:${Math.round(latestMute/1000)}:f> (<t:${Math.round(latestMute/1000)}:R>)` : `N/A`}`)
                .addField(`Ban Information`, `\`Bans issued:\` ${bans.length}\n\`Latest ban issued:\` ${latestBan !== 0 ? `<t:${Math.round(latestBan/1000)}:f> (<t:${Math.round(latestBan/1000)}:R>)` : `N/A`}`)
                .setThumbnail(user.avatarURL({ dynamic:true, size:1024 }))
                .setColor("#5454a4")

            await msg.edit({ content:null, embeds:[embed] })
        }
        catch (err) {
            await message.channel.send(`\`\`\`${err}\`\`\``)
        }
    }
}

