const db = require('../../../db')

module.exports = {
    config: {
        nome: 'cagar',
        cooldown: 10,
        aliases: ['defecar']
    },
    run: async(client, message) => {
        console.log(message.author)
        let quts = client["comandos"+(!message.author ? message.user.id:message.author.id)]
        let priv = await db.consu.findOne({consumidor: (!message.author ? message.user.id:message.author.id)})
        if(!priv) return message.reply('Compre uma privada antes!')
        if(!priv.produtos.includes("privada")) return message.reply('Compre uma privada antes!')
        message.reply('<:pedrinhos:802536483886071830>\n⠀ \n⠀ \n 🚽').then(editar => {
        setTimeout(() => {
   editar.edit('<:pedrinhos:802536483886071830>\n💩\n⠀\n \n 🚽')
        }, 1000)
            setTimeout(() => {
                editar.edit('<:pedrinhos:802536483886071830>\n⠀\n💩\n⠀\n🚽')
            }, 3000)
            setTimeout(() => {
                editar.edit('<:pedrinhos:802536483886071830>\n⠀\n\n💩\n🚽')
            }, 5000)
            setTimeout(() => {
                editar.edit('<:pedrinhos:802536483886071830>\n⠀\n💦\n 🚽')
            }, 6000)
            setTimeout(() => {
                editar.edit('<:pedrinhos:802536483886071830>\n💦\n⠀\n 🚽')
            }, 7000)
            setTimeout(() => {
                if(quts >= 6) {
                    return  editar.edit('Você está com diarreia! Cristo ta um fedor...')
                }
                editar.edit('Você se cagou agora está aliviado!')
            }, 9000)
        })
    }
}