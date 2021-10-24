const { MessageEmbed } = require('discord.js')
const db = require('../../../db')
const langs = require('../../../langs.json')
const embed = new MessageEmbed()
module.exports = {
    config: {
        nome: 'jornalinfo',
        cooldown: 8
    },
    run: async(client, message, args ) => {
        const lan = await db.lgs.findOne({guildID: !message.author ? message.user.id:message.author.id})
        if(!args[0]) return message.reply(lan && lan.lang === 'en' ? langs.en.noName:langs.pt.noName)
        const jor = await db.empr.findOne({nametolower: args[0].toLowerCase()})
        if(!jor) return message.reply(lan && lan.lang === 'en' ? langs.en.naoexistente:langs.pt.naoexistente)
        const embed = new MessageEmbed()
        .setColor('#9900f8')
        .setTitle(`${client.user.username} - ${lan && lan.lang == 'en' ? "Newspaper":"Jornal"}`)
        .addField(lan && lan.lang == 'en' ? 'Newspaper name':'Nome do jornal', `${jor.name}`, true)
        .addField(lan && lan.lang == 'en' ? 'Matters already done':'Máterias ja feitas', `${jor.materias.length}`, true)
        .addField(lan && lan.lang == 'en' ? "Language":"Linguagem", jor.lang === 'en' ? "English":"Portugues", true)
        .addField(lan && lan.lang == 'en' ? "Newspaper owner":"Dono do jornal",`${(await client.users.fetch(jor.dono)).username}`, true)
        .addField(lan && lan.lang == 'en' ? "Journalists":"Jornalistas",`${jor.jornalistas.map(x => x.username).join(', ') || "Sem jornalistas"}`, true)

        message.reply({embeds: [embed]})
        
    }
}