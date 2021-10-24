const db = require('../../../db')
const langs = require('../../../langs.json')
module.exports = {
    config: {
        nome: 'addjornalistas'
    },
    run: async(client, message, args ) => {
        const lan = await db.lgs.findOne({guildID: !message.author ? message.user.id:message.author.id})
        const jor = await db.empr.findOne({dono: !message.author ? message.user.id:message.author.id})
        if(!jor) return message.reply(lan && lan.lang === 'en' ? langs.en.existente:langs.pt.naoexistente)
        const reporter = message.mentions.users.first()
        if(!reporter) return message.reply('Mencione o jornalista!')
        await db.empr.findOneAndUpdate({dono: !message.author ? message.user.id:message.author.id}, {$push: {jornalistas: {id: reporter.id, username: reporter.username}}})
        message.reply('Adicionei com sucesso um jornalista!')
    }
}