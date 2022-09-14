const banUser = require("../utils/moderation/banUser")
const logBan = require("../utils/logging/ban")

module.exports = {
    name: "unban",
    description: "Unban a user!",
    async execute(client, message, args) {
        try {
            if (!message.member.permissions.has("BAN_MEMBERS"))  return await message.reply(`<:michael_error:1001860943380217906> You don't have permission to use this command!`)
            if (!args[0]) return await message.reply(`<:michael_error:1001860943380217906> You haven't provided a user to unban!`)
            const userMatches = args[0].replace("<", "").replace("@", "").replace("!", "").replace(">", "")
            if (!userMatches) return await message.reply(`<:michael_error:1001860943380217906> You haven't provided a user to unban!`)

            const user = await client.users.fetch(userMatches)

            if (!user) return await message.reply(`<:michael_error:1001860943380217906> Invalid user provided!`)

            const ban = await message.guild.bans.fetch(user).catch(async () => { })
            if (!ban) return await message.reply(`<:michael_error:1001860943380217906> This user isn't banned!`)

            args.splice()
            const reason = args.join(" ") || `No reason provided`
            await message.guild.bans.remove(user, reason)
            await message.channel.send(`<:michael_success:1001860958462939156> Successfully unbanned \`${user.username}#${user.discriminator}\`!`)
        }
        catch (err) {
            await message.channel.send(`\`\`\`${err}\`\`\``)
        }
    }
}

