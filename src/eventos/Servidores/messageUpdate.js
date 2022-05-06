const db = require('../../../db.js')
const { MessageEmbed } = require('discord.js')
module.exports = async(client, newMessage, oldMessage) => {
    const guild = await db.idgr.findOne({group: oldMessage.guild?.id || newMessage.guild.id})
    if(!guild) return
    else {
        if(!newMessage.content && !oldMessage.content) return
        if(guild.logs.includes('edit')) {
            if(oldMessage.channel.type === 'dm') return;
            if(oldmessage.user.bot) return;
            if(oldMessage.embeds[0]) return;
            let canal = client.channels.cache.get(guild.channellogs)
            if(!canal) return await db.idgr.findOneAndRemove({group: oldMessage.guild?.id || newMessage.guild.id})
            const embed = new MessageEmbed()
                .setColor('#9900f8')
                .setTitle(`${client.user.username} - Logs`)
                .setDescription(`**Uma mensagem foi editada!** \nUsuario: ${oldmessage.user.username} \n \nMensagem antiga: ${newMessage.content}\n \nMensagem nova: ${oldMessage.content}`)
            canal.send({embeds: [embed]})
        }
    }
}