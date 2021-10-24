const db = require('../../../db')
const langs = require('../../../langs.json')
module.exports = {
    config: {
        nome: 'criarmateria'
    },
    run: async(client, message, args ) => {
        const lan = await db.lgs.findOne({guildID: !message.author ? message.user.id:message.author.id})
        if(!args[0]) return message.reply(lan && lan.lang === 'en' ? langs.en.noName:langs.pt.noName)
        const jor = await db.empr.findOne({nametolower: args[0].toLowerCase()})
        if(!jor) return message.reply(lan && lan.lang === 'en' ? langs.en.naoexistente:langs.pt.naoexistente)
        let jor2 = jor.jornalistas.map(x => x.id)
        if(!message.author ? message.user.id:message.author.id !== jor.dono) {
        if(!(jor2.some(x => !message.author ? message.user.id:message.author.id.includes(x)))) return message.reply(lan && lan.lang === 'en' ? langs.en.noJornalista:langs.pt.noJornalista)
        }
        let title = message.channel.createMessageCollector({filter: ({author}) => author.id === message.author.id})
        message.reply('Digite o titulo da materia')
        title.on('collect', async ro => {
            
        let meter = message.channel.createMessageCollector({filter: ({author}) => author.id === message.author.id})
        message.reply('Agora digite a noticia')
        meter.on('collect', async me => {
            await db.empr.findOneAndUpdate({nametolower: args[0].toLowerCase()}, {$push: {materias: {titulo: ro.content, materia: me.content, jornal: args[0], jornalistas: message.author.username}}})
            message.reply('Materia criada com sucesso!')
            meter.stop()
        })
       })
    }
}