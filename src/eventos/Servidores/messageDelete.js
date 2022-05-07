const db = require('../../../db.js');
const { MessageEmbed } = require('discord.js');

module.exports = async (client, message) => {
    if (!message.author || message.author.bot || message.author.id === client.user.id) return;

    let guild = await db.idgr.findOne({ group: message.guild.id });
    if (!guild || !guild.logs.includes('deletes')) return;

    let canal = client.channels.cache.get(guild.channellogs);
    const embed = new MessageEmbed()
        .setColor('#9900f8')
        .setTitle(`${client.user.username} - Logs`)
        .setDescription(`**Uma mensagem deletada!**\nUsuario: ${message.author.username}\n\nMensagem deletada: ${message.content}`);
    canal.send({ embeds: [embed] });
};
