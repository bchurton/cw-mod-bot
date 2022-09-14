const modLogs = require("../utils/logging/modLog")

module.exports = {
    name: "guildBanAdd",
    async execute(client, ban) {
	
        try {
            setTimeout(async function() {

                const fetchedLogs = await ban.guild.fetchAuditLogs({
                    limit: 1,
                    type: 'MEMBER_BAN_ADD',
                }).catch(() => {})
    
                const banLog  = fetchedLogs.entries.first();

                if (!banLog ) return
    
                var { executor, target, reason, id } = banLog ;
    
                modLogs(client, "ban", target, executor, reason)

            }, 2500)
            
        }
        catch (err) {
            client.Sentry.captureException(err);
            console.log(err)
        }
    }
}
