const unmuteUser = require("../utils/moderation/unmuteUser")
const logUnmute = require("../utils/logging/unmute")

module.exports = {
    name: "unmute",
    description: "Mute someone!",
    aliases:["untimeout", "unshush", "unsilence", "unstfu"],
    async execute(client, message, args) {
        try {
            if (!message.member.permissions.has("MODERATE_MEMBERS"))  return await message.reply(`<:michael_error:1001860943380217906> You don't have permission to use this command!`)
            if (!args[0]) return await message.reply(`<:michael_error:1001860943380217906> You haven't provided a user to unmute!`)
            const userMatches = args[0].replace("<", "").replace("@", "").replace("!", "").replace(">", "")
            if (!userMatches) return await message.reply(`<:michael_error:1001860943380217906> You haven't provided a user to unmute!`)

            const user = await client.users.fetch(userMatches)

            if (!user) return await message.reply(`<:michael_error:1001860943380217906> Invalid user provided!`)

            args.shift()

            const reason = args.join(" ") || `No reason provided`

            const unmute = await unmuteUser(user, reason, message.author, message.guild, message.member)

            if (!unmute[0]) {
                return await message.reply(`<:michael_error:1001860943380217906> ${unmute[1]}`) 
            }

            await message.reply(`<:michael_success:1001860958462939156> Successfully unmuted \`${user.username}#${user.discriminator}\` for \`${reason}\`!`)
            await logUnmute(client, user, message.author, reason)
        }
        catch (err) {
            await message.channel.send(`\`\`\`${err}\`\`\``)
        }
    }
}

