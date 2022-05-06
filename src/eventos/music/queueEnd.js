const { MessageEmbed, Client } = require('discord.js')
/**
 * 
 * @param {Client} client 
 */

module.exports = (client, player, track) => {
    let channel = client.channels.cache.get(player.textChannelId)
    if (!channel) return;
    if (player.queue.length > 0 || player.trackRepeat || player.queueRepeat) return;
    const embed = new MessageEmbed()
        .setTitle(`${client.user.username} - Música`)
        .setColor('#9900f8')
        .setDescription(`A música **${track?.title}** acabou!`)
    if(!track) return player.destroy()
    channel.send({ embeds: [embed] }).then(msg => {
        player.destroy()
    })

}