const banUser = require("../utils/moderation/banUser")
const logBan = require("../utils/logging/ban")

module.exports = {
    name: "ban",
    description: "Ban a user!",
    async execute(client, message, args) {

        if (!message.member.permissions.has("BAN_MEMBERS"))  return await message.reply(`<:michael_error:1001860943380217906> You don't have permission to use this command!`)
        if (!args[0]) return await message.reply(`<:michael_error:1001860943380217906> You haven't provided a user to ban!`)
        const userMatches = args[0].replace("<", "").replace("@", "").replace("!", "").replace(">", "")
        if (!userMatches) return await message.reply(`<:michael_error:1001860943380217906> You haven't provided a user to ban!`)

        const user = await client.users.fetch(userMatches)

        if (!user) return await message.reply(`<:michael_error:1001860943380217906> Invalid user provided!`)

        args.shift()
        const reason = args.join(" ") || `No reason provided`

        const ban = await banUser(user, reason, message.author, message.guild, message.member)

        if (!ban[0]) {
            return await message.reply(`<:michael_error:1001860943380217906> ${ban[1]}`) 
        }

        await message.reply(`<:michael_success:1001860958462939156> Successfully banned \`${user.username}#${user.discriminator}\` for \`${reason}\`!`)
        await logBan(client, user, message.author, reason)
    }
}
