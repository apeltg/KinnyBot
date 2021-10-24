const youtubeMp3Converter = require('youtube-mp3-converter')
const yts = require("yt-search")
const db = require('../../../db')
const { MessageEmbed } = require('discord.js')
const fetch = require('node-fetch')
const fs = require('fs')
module.exports = {
    config: {
        nome: 'mp3downloader',
        cooldown: 15,
        aliases: ['baixar', 'ytdownloader'],
        options: [{
            name: 'link',
            type: 'STRING',
            description: 'Link da musica que vai ser baixado no youtube',
            required: true,
        }],
    },
    run: async (client, message, args) => {
        let premi = await db.premi.findOne({ groupid: !message.author ? message.user.id : message.author.id })
        if (!premi) return message.reply(`${client.user.username} - Erro \n Esse comando é para pessoas que possui o Kinny Premium. Quer ter desbloqueado? Compre o kinny premium!`)
        let creating = await db.con.findOne({ id: !message.author ? message.user.id : message.author.id })
        if (!creating) {
            await db.con.create({ id: !message.author ? message.user.id : message.author.id, converting: false })
        }
        creating = await db.con.findOne({ id: !message.author ? message.user.id : message.author.id })
        if (!args[0] && !message.options?.getString('link')) return message.reply('Digite o nome da musica!')
        if (creating.converting) return message.reply('Você já esta convertendo uma musica!')
        await db.con.findOneAndUpdate({ id: !message.author ? message.user.id : message.author.id }, { converting: true })
        const r = await yts(args?.join(" ") || message.options?.getString('link'))
        let verificar = !message.author ? message.user.id : message.author.id
        const down = message.channel.createMessageCollector({ filter: ({ author }) => author.id === verificar, max: 1 })
        const embed5 = new MessageEmbed()
            .setColor('#9900f8')
            .setDescription(`> Escolha uma musica, listei 10 musicas para você escolher a certa! \n \n\`${r.videos.map((x, i) => i + "- " + x.title).slice(0, 11).join('\n')}\``)
        message.reply({ embeds: [embed5] })
        down.on('collect', async a => {
            if (a.content.toLowerCase() === 'cancelar') {
                await db.con.findOneAndUpdate({ id: !message.author ? message.user.id : message.author.id }, { converting: false })
                message.reply('Lista cancelada!')
                return down.stop()
            }
            if (isNaN(a.content)) {
                await db.con.findOneAndUpdate({ id: !message.author ? message.user.id : message.author.id }, { converting: false })
                return message.reply('Não é um numero!')
            }
            if (parseInt(a.content) > 10) {
                await db.con.findOneAndUpdate({ id: !message.author ? message.user.id : message.author.id }, { converting: false })
                return message.reply('Esse numero não corresponde na lista!')

            }
            const videos = r.videos[parseInt(a.content)]
            if (!videos) {
                await db.con.findOneAndUpdate({ id: !message.author ? message.user.id : message.author.id }, { converting: false })
                return message.reply('Não existe essa musica! Se está digitando o link digite apenas o nome!')
            }
            const convertLinkToMp3 = youtubeMp3Converter('./src/comandos/atodos/musics')
            const embed = new MessageEmbed()
                .setColor('#9900f8')
                .setTitle(`${client.user.username} - Música`)
                .setDescription('<:config:806875469173620771> Iniciando a conversão')
            message.reply({ embeds: [embed], fetchReply: true }).then(async msg => {
                if (videos.duration.seconds > 90000) {
                    const embed = new MessageEmbed()
                        .setColor('#9900f8')
                        .setTitle(`${client.user.username} - Música`)
                        .setDescription('❌ O audio e longo demais! O maximo é 3 horas!')
                    await db.con.findOneAndUpdate({ id: !message.author ? message.user.id : message.author.id }, { converting: false })
                    return msg.edit({ embeds: [embed] })
                }
                const embed = new MessageEmbed()
                    .setColor('#9900f8')
                    .setTitle(`${client.user.username} - Música`)
                    .setDescription('<a:carregando:800011672122556447> Aguarde!')
                await db.con.findOneAndUpdate({ id: !message.author ? message.user.id : message.author.id }, { converting: true })
                msg.edit({ embeds: [embed] })
                const pathToMp3 = await convertLinkToMp3(videos.url)
                if (pathToMp3.length) {
                    await db.con.findOneAndUpdate({ id: !message.author ? message.user.id : message.author.id }, { converting: false })
                    const embed3 = new MessageEmbed()
                        .setColor('#9900f8')
                        .setTitle(`${client.user.username} - Música`)
                        .setDescription('<:play:816662164668153856> Conversão concluida')
                    msg.edit({ embeds: [embed3] })
                    str = videos.title.replace(/[^a-zA-Z0-9.()Á-ú!\-.[] ]/gi, '');
                    if (fs.statSync(`./src/comandos/atodos/musics/${str}.mp3`).size > 8000000) {
                        if (fs.statSync(`./src/comandos/atodos/musics/${str}.mp3`).size > 104857600) {
                            return message.reply('Infelizmente o arquivo passa dos 100 MB e não é possivel ser enviada!')
                        }
                        message.reply('O arquivo ficou grande demais! E estou tentando upar em 1 lugar para você baixar, irei mencionar caso de tudo certo')
                        await db.con.findOneAndUpdate({ id: !message.author ? message.user.id : message.author.id }, { converting: false })
                        fetch(`https://sd-us1.ultrahostbr.com/api/client/servers/97e1783b/files/download?file=%2F/src/comandos/atodos/musics/${str}.mp3`, {
                            method: 'POST',
                            body: formData
                        }).then(v => v.json()).then(async v => {

                            if (v.success) {
                                message.reply(`Consegui enviar a musica! Download: ${v.files[0].url}`)
                                await db.con.findOneAndUpdate({ id: !message.author ? message.user.id : message.author.id }, { converting: false })
                            } else {
                                message.reply(`Sem sucesso! Não consegui upar a musica: ${v.description}`)
                            }
                            
                        })
                    }
                    message.reply('Musica baixada com sucesso!')
                    message.reply({
                        files: [{
                            attachment: `./src/comandos/atodos/musics/${str}.mp3`,
                            name: `${videos.title}.mp3`
                        }]
                    }).catch(error => {
                        message.reply('Ocorreu um erro ao tentar enviar a musica! Fale com LMS5413 sobre o ocorrido')
                        console.log(error)
                        let dir = './src/comandos/atodos/musics'
                        fs.readdir(dir, (err, files) => {
                            if (files.length < 1) {
                                return console.log("Sem musica para excluir")
                            } else {
                                for (i = 0; i < files.length; i++) {
                                    fs.unlink(`${dir}/${files[i]}`, function (err) {
                                        if (err) return console.log(err);
                                    });
                                }
                                console.log("Todas musicas excluidas.")
                            }
                        })
                    })
                    let dir = './src/comandos/atodos/musics'
                    fs.readdir(dir, (err, files) => {
                        if (files.length < 1) {
                            return console.log("Sem musica para excluir")
                        } else {
                            for (i = 0; i < files.length; i++) {
                                fs.unlink(`${dir}/${files[i]}`, function (err) {
                                    if (err) return console.log(err);
                                });
                            }
                            console.log("Todas musicas excluidas.")
                        }
                    })
                    
                }
            })
        })
    }
}