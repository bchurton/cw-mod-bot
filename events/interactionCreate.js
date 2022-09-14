const config = require("../utils/config.json")
const { Modal, TextInputComponent, showModal } = require('discord-modals'); // Import all
const { database } = require("../utils/database")

module.exports = {
    name: "interactionCreate",
    async execute(client, interaction) {
        const stars = interaction.customId.split("-")[0]
        const expiry = Math.round(Number(interaction.customId.split("-")[1])/1000)
        const msgID = interaction.message.id
        
        const db = await database.collection("gamenightfeedback").findOne({ user:interaction.user.id, msg:interaction.message.id })
        if (db) return await interaction.reply({ content:`You've already given feedback for this game night!`, ephemeral:true })
        if (Math.round(Date.now()/1000) - expiry > 43200) return await interaction.reply({ content:`This feedback form has expired!`, ephemeral:true })

        const modal = new Modal()
            .setCustomId(`${stars}-${msgID}`)
            .setTitle('Game Night Feedback')
            .addComponents(
                new TextInputComponent() // We create a Text Input Component
                    .setCustomId('feedback')
                    .setLabel('Comments (Optional)')
                    .setStyle('LONG')
                    .setPlaceholder('Write your feedback here - completely optional!!')
                    .setRequired(false),
            );
        
        showModal(modal, {
            client: client,
            interaction: interaction
        });
    }
}