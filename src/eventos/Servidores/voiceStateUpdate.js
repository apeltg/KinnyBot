const { MessageEmbed, Client, VoiceState } = require('discord.js');
const db = require('../../../db')
/**
 * 
 * @param {Client} client 
 * @param {VoiceState} oldState
 * @param {VoiceState} newState
 * @returns
 */
module.exports = async (client, oldState, newState) => {
    const player = client.manager.players.get(oldState.guild.id)
    if (oldState.channel && !newState.channel) {
        if (player) {
            if(player.voiceChannelId !== oldState.channelId) return
            if (newState.member.id === client.user.id) {
                player.timeout = null
                return player.destroy()
            }
            let channel = client.channels.cache.get(player.textChannelId)
            if (oldState.channel.members.size === 1 && oldState.channel.members.find(x => x.id === client.user.id)) {
                channel.send(`${client.users.cache.get(oldState.member.id).toString()} você saiu do canal de voz! Vou esperar 2 minutos para você voltar senão irei destruir essa música`)
                player.pause(true)
                player.timeout = setTimeout(() => {
                    channel.send('Os 2 minutos se passaram e ningugem compareçeu! Vou destruir essa música!')
                    player.destroy()
                }, 60000 * 2)
            }
        }
    }
    if (!oldState.channel && newState.channel) {
        if(player && player.timeout) {
            if(player.voiceChannelId !== newState.channelId) return
            if(!player.timeout) return;
            clearTimeout(player.timeout)
            player.pause(false)
            player.timeout = null
        }
    }
    let log = await db.idgr.findOne({ group: oldState.guild.id })
    if (!log) return;
    if (log.logs.includes('voice')) {
        let canal = client.channels.cache.get(log.channellogs)
        if (!oldState.channel && newState.channel) {
            if (newState.id === client.user.id) return;
            const embed = new MessageEmbed()
                .setColor('#9900f8')
                .setTitle(`${client.user.username} - Logs`)
                .setDescription(`**Uma pessoa entrou em 1 canal de voz!**\nNome: ${client.users.cache.get(newState.id).username}\n \nCanal: ${newState.channel.name}`)
            canal.send({ embeds: [embed] })
        } else {
            if (newState.channel) return;
            const embed = new MessageEmbed()
                .setColor('#9900f8')
                .setTitle(`${client.user.username} - Logs`)
                .setDescription(`**Uma pessoa saiu em 1 canal de voz!**\nNome: ${client.users.cache.get(oldState.id).username}\n \nCanal: ${oldState.channel.name}`)
            canal.send({ embeds: [embed] })
        }
    }
}