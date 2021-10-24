const { MessageEmbed } = require('discord.js')
module.exports =  {
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
    run: async(client, message, args) => {
        let id = !message.isCommand ? args[0]:message.options?.getString('user')
        let avata = message.mentions?.members.first() || await message.guild.members.fetch(!id ? !message.author ? message.user.id:message.author.id:id.replace(/[<@!>]/g, ''))
        const embed = new MessageEmbed()
            .setColor('#9900f8')
            .setTitle(`${client.user.username} - Diversão`)
            .setDescription(`<:imagem:800011671229431848> Avatar de ${avata} [Clique aqui para baixar!](${avata?.displayAvatarURL({dynamic: true, size: 4096, format: 'png'})})` ?? `(${avata.user.displayAvatarURL({dynamic: true, size: 4096, format: 'png'})})`)
            .setImage(avata?.displayAvatarURL({dynamic: true, size: 4096, format: 'png'}) ?? avata.user.displayAvatarURL({dynamic: true, size: 4096, format: 'png'}))
        if(message.isCommand) {
            message.reply({embeds: [embed]})
        } else {
            message.reply({embeds: [embed]}).then(reagir => {
                reagir.react('👍')
                reagir.react('👎')
                reagir.react('😎')
                reagir.react('😍')
                reagir.react('😢')
                reagir.react('😡')
    
            })
        }
    }
}