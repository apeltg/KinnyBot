const { MessageEmbed, MessageAttachment } = require('discord.js')
const Canvas = require('canvas')
module.exports =  {
    config: {
        nome: 'banner',
        cooldown: 10,
        options: [{
            name: 'usuario',
            type: 'STRING',
            description: 'User da pessoa',
            required: false,
        }],
    },
    run: async(client, message, args) => {
        let id = !message.isCommand ? args[0]:message.options?.getString('usuario')
        let user = message.mentions?.users.first() || client.users.cache.get(!id ? message.user.id:id.replace(/[<@!>]/g, '')) || await client.users.fetch(!id ? message.user.id:id.replace(/[<@!>]/g, ''));
        let banner = await client.api.users(user.id).get()
        if(!banner.banner && !banner.banner_color) return message.reply('Essa pessoa não possui uma banner!')
        if(!banner.banner && banner.banner_color) {
            const canvas = Canvas.createCanvas(1365, 450);
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = `#${(banner.accent_color >>> 0).toString(16).padStart(6, '0').toUpperCase()}`
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            const attachment = new MessageAttachment(canvas.toBuffer(), 'banner.png');
            const embed = new MessageEmbed()
            .setTitle(`${client.user.username} - Banner`)
            .setColor((banner.accent_color >>> 0).toString(16))
            .setDescription(`Banner de ${user.username}!`)
            .setImage('attachment://banner.png')
            message.reply({embeds: [embed], files: [attachment]})
             
        } else {
            const embed = new MessageEmbed()
            .setTitle(`${client.user.username} - Banner`)
            .setColor('#9900f8')
            .setDescription(`Banner de ${user.username}! [clique para baixar!](https://cdn.discordapp.com/banners/${user.id}/${banner.banner}.${banner.banner.startsWith('a_') ? 'gif':'png'}?size=4096)`)
            .setImage(`https://cdn.discordapp.com/banners/${user.id}/${banner.banner}.${banner.banner.startsWith('a_') ? 'gif':'png'}?size=4096`)
            message.reply({embeds: [embed]})
        }
    }
}