const { MessageEmbed } = require('discord.js');
const db = require('../../../db')

module.exports = async(client, oldState, newState) => {
   let log = await db.idgr.findOne({group: oldState.guild.id})
   if(!log) return;
   if(log.logs.includes('voice')) { 
   let canal = client.channels.cache.get(log.channellogs) 
   if(!oldState.channel && newState.channel) {
      if(newState.id === client.user.id) return;
      const embed = new MessageEmbed()
      .setColor('#9900f8')
      .setTitle(`${client.user.username} - Logs`)
      .setDescription(`**Uma pessoa entrou em 1 canal de voz!**\nNome: ${client.users.cache.get(newState.id).username}\n \nCanal: ${newState.channel.name}`)
  canal.send({embeds: [embed]})
   } else {
       if(newState.channel) return;
      const embed = new MessageEmbed()
      .setColor('#9900f8')
      .setTitle(`${client.user.username} - Logs`)
      .setDescription(`**Uma pessoa saiu em 1 canal de voz!**\nNome: ${client.users.cache.get(oldState.id).username}\n \nCanal: ${oldState.channel.name}`)
  canal.send({embeds: [embed]})
   }
} else return;  
}