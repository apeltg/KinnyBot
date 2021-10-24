const db = require('../../../db')

module.exports = { 
    config: {
        nome: 'commandchannel',
        aliases: ['setcommandchannel']
    },
    run: async(client, message, args) => {
        if(!message.member.permissions.has('ADMINISTRATOR')) return message.reply(`${client.user.username} - Erro \n Você tem que ter a permissão \`administrador\``)
        const canal = message.mentions.channels.first() || client.channels.cache.get(args[0])
        if(!canal) return message.reply('Mencione o canal ou digite o id dele!')

        const ch = await db.can.findOne({groupid: message.guild.id})
        !ch ? await db.can.create({groupid: message.guild.id, channel: canal.id}):await db.can.findOneAndUpdate({groupid: message.guild.id}, {channel: canal.id})

        message.reply(`Agora as pessoas so pode executar comandos em ${canal}!`)
    }
}