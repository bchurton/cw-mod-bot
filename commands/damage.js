const damageUser = require("../utils/moderation/damageUser")
const logDamage = require("../utils/logging/damage")
const { MessageReaction } = require("discord.js")

module.exports = {
    name: "damage",
    description: "Damage a user!",
    async execute(client, message, args) {

        if (!message.member.permissions.has("MANAGE_MESSAGES"))  return await message.reply(`<:michael_error:1001860943380217906> You don't have permission to use this command!`)
        if (!args[0]) return await message.reply(`<:michael_error:1001860943380217906> You haven't provided a user to damage!`)
        const userMatches = args[0].replace("<", "").replace("@", "").replace("!", "").replace(">", "")
        if (!userMatches) return await message.reply(`<:michael_error:1001860943380217906> You haven't provided a user to damage!`)

        const user = await client.users.fetch(userMatches)

        if (!user) return await message.reply(`<:michael_error:1001860943380217906> Invalid user provided!`)

        args.shift()
        if (!args[0]) return await message.reply(`<:michael_error:1001860943380217906> You haven't provided a damage amount!`)
        const amount = args[0]
        if (isNaN(amount)) return await message.reply(`<:michael_error:1001860943380217906> Damage amount must be a **number**!`)
        args.shift()
        const reason = args.join(" ") || `No reason provided`

        const damage = await damageUser(client, user, reason, message.author, message.guild, message.member, amount)

        if (!damage[0]) {
            return await message.reply(`<:michael_error:1001860943380217906> ${damage[1]}`) 
        }

        await message.reply(`<:michael_success:1001860958462939156> Successfully damaged \`${user.username}#${user.discriminator}\` ${amount} time${Number(amount) === 1 ? `` : `s`} for \`${reason}\`! They now have ${damage[1]} damage${damage[2] ? `, and ${damage[3]}` : ``}.`)
        await logDamage(client, amount, damage[1], user, message.author, reason)
    }
}
