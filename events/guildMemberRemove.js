const modLogs = require("../utils/logging/modLog")

module.exports = {
    name: "guildMemberRemove",
    async execute(client, member) {
	try {
        const fetchedLogs = await member.guild.fetchAuditLogs({
            limit: 1,
            type: 'MEMBER_KICK',
        });

        const kickLog = fetchedLogs.entries.first();
        if (!kickLog) return

        var { executor, target, reason, id } = kickLog;
        

        if (target.id === member.id) {
            modLogs(client, "kick", target, executor, reason)
        }
	}
	catch (err) {
        client.Sentry.captureException(err);
		console.log(err)
	}
    }
}
