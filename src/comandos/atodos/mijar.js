const { MessageEmbed } = require('discord.js')
const db = require('../../../db')
module.exports = {
    config: {
        nome: 'mijar',
        cooldown: 10,
    },
    run: async(client, message, args) => {
        let priv = await db.consu.findOne({consumidor: !message.author ? message.user.id:message.author.id})
        if(!priv) return message.reply('Compre uma privada antes!')
        if(!priv.produtos.includes("privada")) return message.reply('Compre uma privada antes!')
        message.reply('⠀⠀⠀⠀🚶‍♂️\n 🏳️').then(editar => {
            setTimeout(() => {
                editar.edit('⠀⠀⠀⠀🚶‍♂️\n 🏳️  ☄️')
            }, 1000)
            setTimeout(() => {
                editar.edit('⠀⠀⠀⠀🚶‍♂️\n 🏳️ ️')
            }, 4000)
            setTimeout(() => {
                editar.edit('⠀⠀⠀⠀️\n 🏳️ ️')
            }, 6000)
            setTimeout(() => {
                editar.edit('QUE MIJAO BEM DADO, NÃO TINHA BANHEIRO NOS MIJA NA BANDEIRA ALEATORIO MESMO')
            }, 8000)
        })

    }
}