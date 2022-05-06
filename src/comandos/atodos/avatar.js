const { MessageEmbed } = require('discord.js')
module.exports = {
    config: {
        nome: 'avatar',
        cooldown: 10,
        options: [{
            name: 'user',
            type: 'STRING',
            description: 'User da pessoa',
            required: false,
        }],
    },
    run: async (client, message, args) => {
        try {
            let id = message.options?.getString('user')
            let avata = await message.guild.members.fetch(!id ? message.user.id : id.replace(/[<@!>]/g, ''))
            const embed = new MessageEmbed()
                .setColor('#9900f8')
                .setTitle(`${client.user.username} - Diversão`)
                .setDescription(`<:imagem:800011671229431848> Avatar de ${avata} [Clique aqui para baixar!](${avata?.displayAvatarURL({ dynamic: true, size: 4096, format: 'png' })})` ?? `(${avata.user.displayAvatarURL({ dynamic: true, size: 4096, format: 'png' })})`)
                .setImage(avata?.displayAvatarURL({ dynamic: true, size: 4096, format: 'png' }) ?? avata.user.displayAvatarURL({ dynamic: true, size: 4096, format: 'png' }))
            if (message.isCommand) {
                message.reply({ embeds: [embed] })
            } else {
                message.reply({ embeds: [embed] }).then(reagir => {
                    reagir.react('👍')
                    reagir.react('👎')
                    reagir.react('😎')
                    reagir.react('😍')
                    reagir.react('😢')
                    reagir.react('😡')

                })
            }
        } catch (e) {
            message.reply(`${client.user.username} Erro \nOcorreu um erro ao tentar obter o avatar desse usuário! Erro: ${e.message}`)
        }
    }
}