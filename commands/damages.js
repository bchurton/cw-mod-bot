const { MessageEmbed } = require("discord.js")
const { database } = require("../utils/database")
const chunk = require("../utils/chunking")

module.exports = {
    name: "damages",
    description: "Get a user's damages!",
    async execute(client, message, args) {
        try {
            if (!message.member.permissions.has("MANAGE_MESSAGES"))  return await message.reply(`<:michael_error:1001860943380217906> You don't have permission to use this command!`)
            if (!args[0]) return await message.reply(`<:michael_error:1001860943380217906> You haven't provided a user to check!`)
            const userMatches = args[0].replace("<", "").replace("@", "").replace("!", "").replace(">", "")
            if (!userMatches) return await message.reply(`<:michael_error:1001860943380217906> You haven't provided a user to check!`)

            const user = await client.users.fetch(userMatches)

            if (!user) return await message.reply(`<:michael_error:1001860943380217906> Invalid user provided!`)

            const msg = await message.channel.send(`Fetching damages...`)
            
            let totalDamage = 0
            const totalDamages = await database.collection("moderations").find({ userid:user.id, punishment:"damage" }).sort({ _id:-1 }).toArray()
            console.log(totalDamages)

            if (!totalDamages.length > 0) {
                let embed = new MessageEmbed()
                    .setTitle(`Damage information for ${user.username}`)
                    .setDescription(`They've recieved 0 total damage, and have been damaged 0 times.`)
                return await msg.edit({ content:null, embeds:[embed] })
            }

            let allPunishments = []


            await Promise.all(totalDamages.map(damage => {
                allPunishments.push(`\`Reason:\` ${damage.reason}\n\`Damage:\` ${damage.damageAmount}\n\`Moderator:\` <@${damage.moderator}>\n\`Recieved:\` <t:${Math.round(damage.dateTime/1000)}:R>`)
                if (isNaN(damage.damageAmount)) return console.log(damage.damageAmount)
                else totalDamage += Number(damage.damageAmount)
            }))
            

            let embeds = []
            let chunkedArray = []
            if (allPunishments.length <= 5) chunkedArray = [allPunishments]
            else chunkedArray = chunk(allPunishments, 5)
            let embed = new MessageEmbed()
                .setTitle(`Damage information for ${user.username}`)
                .setDescription(`They've recieved ${totalDamage} total damage, and have been damaged ${allPunishments.length} times.\n\n${chunkedArray[0].join("\n\n")}`)
            
            embeds.push(embed)
            chunkedArray.shift()

            await Promise.all(chunkedArray.map(array => {
                let embed = new MessageEmbed()
                    .setDescription(array.join("\n\n"))
                embeds.push(embed)
            }))
            
            await msg.edit({ content:null, embeds })
        }
        catch(err) {
            await message.channel.send(`\`\`\`${err}\`\`\``)
        }
    }
}
