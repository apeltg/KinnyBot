const { MessageEmbed } = require('discord.js')

module.exports = async(client, guild) => {
        console.log('a')
        let servidor = client.guilds.cache.get('800349226919788586')
        let clm = servidor.channels.cache.get('803038083293511720')
        const embed = new MessageEmbed()
        .setColor('#9900f8')
        .setTitle(`${client.user.username} - Novo servidor!`)
        .setThumbnail(guild.iconURL({dynamic: true}))
        .addField('Fui adicionado em um novo servidor!', `Grupo: ${guild.name} \nID Do grupo: ${guild.id} \nMembros ${guild.memberCount} \nDono: ${guild.members.cache.get(guild.ownerId).user.username} `)
        clm.send({embeds: [embed]})
}