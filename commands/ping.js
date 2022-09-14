module.exports = {
    name: "ping",
    usage: "ping",
    description: "Get the bots ping!",
    async execute(client, message, args) {
        await message.channel.send(`🏓Latency is ${Date.now() - message.createdTimestamp}ms.`)
    }
}

