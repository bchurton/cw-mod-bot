const axios = require("axios");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")

module.exports = {
    name: "eval",
    description: "Runs code ig",
    aliases: ["e"],
    category: "Settings",
    usage: `eval <code>`,
    async execute(client, message, args) {
        if (message.author.id !== "471409054594498561") return console.log("not big bun")

        const pre_clean = async (code) => {
            let edit = code.replaceAll("```js", "")
            edit = edit.replaceAll("```", "")
            return edit
        }
        const pre_cleaned = await pre_clean(args.join(" "))
        const clean = async (text) => {
            if (text && text.constructor.name == "Promise")
                text = await text;
            if (typeof text !== "string")
                text = require("util").inspect(text, { depth: 1 });
            return text;
        
        }
        try {
            const evaled = await eval(pre_cleaned);
            const cleaned = await clean(evaled);
            if (cleaned.length > 1980) {
                const resp = await axios.post("https://hst.sh/documents", cleaned);
                const url = `https://hst.sh/${resp.data.key}`;
                let embed = new MessageEmbed()
                .setDescription(`I could not send the response because it was too long. View it [here](${url})`)
                return await message.channel.send({embeds: [embed]})
            }
            message.channel.send({ content:`\`\`\`js\n${cleaned}\n\`\`\`` });
        } catch (err) {
            message.channel.send({ content:`\`ERROR\` \`\`\`\n${err}\n\`\`\`` });
        }
    }
}
