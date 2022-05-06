const db = require('../../../db.js')
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js')
const moment = require('moment')
module.exports = {
    config: {
        nome: 'giveaway',
        aliases: ['sorteio', 'sortear'],
        options: [
            {
                name: 'tipo',
                type: 'STRING',
                description: 'Tipo do giveaway (criar, reroll, end)!',
                required: true,
            }
        ],
    },
    run: async (client, message, args) => {
        moment.locale('pt-br')
        var termined = false
        if (!message.options?.getString('tipo')) return message.reply('Digite como quer começar o sorteio (k.giveaway <criar> <reroll> <end>')
        if (message.options?.getString('tipo').toLowerCase() === 'criar') {
            let infogive = await db.give.findOne({ guildID: message.guild.id })
            if (infogive) return message.reply('Já existe sorteio rolando!')
            const perguntas = ['Digite o titulo do sorteio', 'Digite a descrição do sorteio', 'Vão ser quantos ganhadores? (Máximo 10 ganhadores)', 'Qual vai ser o tempo do sorteio (Exemplo: 5d 1h 2m (5 dias, 1 hora, 2 minutos))', 'Qual canal vai começar o sorteio?']
            const respostas = []
            let msg = !message.isCommand ? await message.channel.send(perguntas[0]) : await message.reply(perguntas[0])
            msg = !message.isCommand ? msg : await message.fetchReply()
            let verificar = message.user.id
            const collector = msg.channel.createMessageCollector({ filter: ({ author }) => author.id === verificar, max: perguntas.length })

            collector.on('collect', (result) => {
                respostas.push(result.content)
                if (perguntas[respostas.length - 1] === 'Vão ser quantos ganhadores? (Máximo 10 ganhadores)') {

                    if (Number(respostas[respostas.length - 1]) > 10) {
                        termined = true
                        !message.isCommand ? message.followUp('Você utrapassou de 10 ganhadores!') : msg.reply('Você utrapassou de 10 ganhadores!')
                        return collector.stop()
                    }
                    if (Number(respostas[respostas.length - 1]) <= 0) {
                        termined = true
                        !message.isCommand ? message.followUp('Você colocou 0 ou menor ganhadores!') : msg.reply('Você colocou 0 ou menor ganhadores!')
                        return collector.stop()
                    }
                }
                if (message.isCommand) {
                    if (respostas.length > 4) return collector.stop()
                    message.followUp(perguntas[respostas.length]).catch(error => console.log('Ocorreu erro 1' + error.message))
                } else {
                    if (respostas.length > 4) return collector.stop()
                    msg.reply(perguntas[respostas.length]).catch(error => console.log('Ocorreu erro 2' + error.message))
                }
            })
            collector.on('end', async (collected, reason) => {
                if (termined) return;
                const channelid = message.guild.channels.cache.get(respostas[4].replace(/[<#>]/g, ''))
                if (!channelid) {
                    message.followUp('Esse canal não existe!')
                    return collector.stop()
                }
                let tempo = timeToMilliseconds(respostas[3])
                const embed = new MessageEmbed()
                    .setColor('#9900f8')
                    .setTitle(`${respostas[0]}`)
                    .setDescription(respostas[1] + `\n \n<:ts_relogio:836607879024082984> O sorteio vai se encerrar <t:${Math.round((Date.now() + tempo) / 1000)}:R>\nGanhadores: ${respostas[2]}`)
                const row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('giveaway-enter')
                            .setLabel('Clique aqui para entrar')
                            .setEmoji("825481371891662939")
                            .setStyle('SUCCESS'),
                    );
                let reagir = await channelid.send({ embeds: [embed], components: [row], fetchReply: true }).catch(error => console.log('Ocorreu erro a' + error.message))
                await db.give.create({
                    guildID: message.guild.id,
                    end: false,
                    winners: respostas[2],
                    channel: channelid.id,
                    title: respostas[0],
                    messageID: reagir.id,
                    participants: [],
                    timestamp: Date.now() + tempo,
                })
            })
        } else if (message.options?.getString('tipo').toLowerCase() === 'reroll') {
            infogive = await db.give.findOne({ guildID: message.guild.id })
            if (!infogive) return message.reply('Não existe nenhum sorteio para ser listado')
            reagir = await (client.channels.cache.get(infogive.channel)).messages.fetch(infogive.messageID)
            if (!reagir) return message.reply('Você deletou a mensagem do sorteio!')
            if (!infogive.end) return message.reply('O sorteio atual não acabou!')
            ganhador = infogive.participants
            ganhador = ganhador[Math.round(Math.random() * ganhador.length)]
            message.reply("Decidi um novo ganhador! O ganhador foi anunciado no canal de sorteio")
            for (let i = 0; i < infogive.winners; i++) {
                if (!ganhador) return message.guild.channels.cache.get(infogive.channel).send('Não foi possivel decidir um ganhador!')
                message.guild.channels.cache.get(infogive.channel).send(`O ganhador do sorteio foi ${message.guild.members.cache.get(ganhador).toString()}`)
            }

        } else if (message.options?.getString('tipo').toLowerCase() === 'end') {
            infogive = await db.give.findOne({ guildID: message.guild.id })
            if (!infogive) return message.reply('Não existe nenhum sorteio para ser listado')
            reagir = await client.channels.cache.get(infogive.channel).messages.fetch(infogive.messageID).catch(e => {
                if(e.message === 'Unknown Message') return;
                console.log(e.message)
            })
            if (!reagir) return message.reply('Você deletou a mensagem do sorteio!')
            if (infogive.end) return message.reply('O sorteio já se encerrou!')
            await db.give.findOneAndUpdate({ guildID: message.guild.id }, { end: true })
            ganhador = infogive.participants
            ganhador = ganhador[Math.round(Math.random() * ganhador.length)]
            message.reply("Encerrei o sorteio! Vencedor anunciado no canal que foi criado o sorteio")
            for (let i = 0; i < infogive.winners; i++) {
                if (!ganhador) return message.guild.channels.cache.get(infogive.channel).send('Não foi possivel decidir um ganhador!')
                message.guild.channels.cache.get(infogive.channel).send(`O ganhador do sorteio foi ${message.guild.members.cache.get(ganhador).toString()}`)
            }
            setTimeout(async () => {
                await db.give.findOneAndRemove({ guildID: message.guild.id })
            }, 300000)
            const embed = new MessageEmbed()
                .setColor('#9900f8')
                .setTitle(`${infogive.title}`)
                .setDescription(`Sorteio encerrado! Vencedor anunciado embaixo! \n \nOBS: Caso o dono do sorteio não entregar o que prometeu denuncie para a o LMS5413!`)
                .setFooter({text:`Sorteio encerrado!`})
            reagir.edit({ embeds: [embed] })
        }
    }
}
function timeToMilliseconds(time) {
    const timeUnits = time.replace(/[\d\s]/g, _ => '').toLowerCase().split('')
    const formats = ['d', 'h', 'm', 's']

    const isValid = timeUnits.length === new Set(timeUnits).size && timeUnits.every((u, i, a) => formats.includes(u) && formats.indexOf(a[i - 1]) < formats.indexOf(u))
    if (!isValid) return null

    const formatted = time.replace(/([a-zA-Z])/g, '$1 ').toLowerCase().trim().split(' ').filter(f => !!f)
    if (formatted.some(e => !/[0-9]/.test(e))) return null

    const invalid = { h: 24, m: 60, s: 60 }
    for (const f of formatted) {
        const value = f.replace(/\D/g, '')
        const unit = f.replace(/\d/gi, '')

        if (value >= invalid[unit]) return null
    }

    const convertions = { d: 86_400_000, h: 3_600_000, m: 60_000, s: 1000 }

    return formatted.reduce((acc, curr, i, a) => acc + parseInt(curr.substring(0, curr.length - 1)) * convertions[curr[curr.length - 1]], 0)
}