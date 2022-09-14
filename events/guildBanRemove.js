const modLogs = require("../utils/logging/modLog")

module.exports = {
    name: "guildBanRemove",
    async execute(client, unban) {

        try {
            setTimeout(async function() {

                const fetchedLogs = await unban.guild.fetchAuditLogs({
                    limit: 1,
                    type: 'MEMBER_BAN_REMOVE',
                }).catch(() => {})

                const banLog  = fetchedLogs.entries.first();
                
                if (!banLog ) return

                var { executor, target, reason, id } = banLog ;

                modLogs(client, "unban", target, executor, reason)

            }, 2500)

        }
        catch (err) {
            client.Sentry.captureException(err);
            console.log(err)
        }
    }
}
