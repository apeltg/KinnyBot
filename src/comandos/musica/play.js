const { MessageEmbed } = require('discord.js');
const parseMilliseconds = require('parse-ms');

module.exports = {
    config: {
        nome: 'play',
        aliases: ['tocar'],
        cooldown: 10,
        options: [
            {
            name: 'musica',
            type: 'STRING',
            description: 'Nome da musica que você quer que eu toque',
            required: true,
        },
    ]
    },
    run: async(client, message, args) => {
        const channel = message.member.voice.channel;

        if(!channel) return message.reply(`Para executar esse comando você precisa está em um canal de voz.`);
        if(!message.guild.me.permissions.has('CREATE_INSTANT_INVITE')) return message.reply('Não tenho permissão para criar convites!')
          client.discordTogether.createTogetherCode(message.member.voice.channel.id, 'youtube').then(async invite => {
        const embed = new MessageEmbed()
        .setTitle(`${client.user.username} - Música`)
        .setDescription(`É uma pena que os bots de musica vai acabar mais você acha que a diversão vai deixar de existir? É claro que não! Clica [nesse link](${invite.code}) e desfrute na nova diversão!`)
        message.channel.send({embeds: [embed]})
              });
    }
}