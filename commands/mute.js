const muteUser = require("../utils/moderation/muteUser")
const logMute = require("../utils/logging/mute")
var parse = require('parse-duration')

module.exports = {
    name: "mute",
    description: "Mute someone!",
    aliases:["timeout", "shush", "silence", "stfu"],
    async execute(client, message, args) {

        if (!message.member.permissions.has("MODERATE_MEMBERS"))  return await message.reply(`<:michael_error:1001860943380217906> You don't have permission to use this command!`)
        if (!args[0]) return await message.reply(`<:michael_error:1001860943380217906> You haven't provided a user to mute!`)
        const userMatches = args[0].replace("<", "").replace("@", "").replace("!", "").replace(">", "")
        if (!userMatches) return await message.reply(`<:michael_error:1001860943380217906> You haven't provided a user to mute!`)

        const user = await client.users.fetch(userMatches)

        if (!user) return await message.reply(`<:michael_error:1001860943380217906> Invalid user provided!`)

        args.shift()

        var length = parse(args[0], "ms")
        if (!length) return await message.reply(`<:michael_error:1001860943380217906> Invalid mute length provided!`)
        args.shift()
        const reason = args.join(" ") || `No reason provided`

        const mute = await muteUser(user, reason, message.author, message.guild, message.member, length)

        if (!mute[0]) {
            return await message.reply(`<:michael_error:1001860943380217906> ${mute[1]}`) 
        }

        await message.reply(`<:michael_success:1001860958462939156> Successfully muted \`${user.username}#${user.discriminator}\` for \`${reason}\`! They will be unmuted <t:${Math.round((Date.now() + Math.round(length))/1000)}:R>`)
        await logMute(client, user, message.author, reason, length)
    }
}

