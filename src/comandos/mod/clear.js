module.exports = {
    config: {
        nome: 'clear',
        aliases: ['limpar'],
        cooldown: 10
    },
    run: async(client, message, args) => {
        if(!message.member.permissions.has('ADMINISTRATOR')) return message.reply(`${client.user.username} - Erro \n Você tem que ter a permissão \`Adminstrador!\``)
        if(!message.guild.me.permissions.has('MANAGE_MESSAGES')) return message.reply(`${client.user.username} - Erro \n<a:alerta:806274799638282311> Eu não tenho permissao \`Gerenciar mensagens\``)
        if(message.isCommand) return message.reply('Esse comando não funciona em slash!')
        let clear =  parseInt(args[0])
        if(clear < 2 || clear > 100) return message.reply('você deve informar um número no mínimo 2')

        const channelMessages = await message.channel.messages.fetch({ limit: clear }),
            oldMessages = channelMessages.filter(m => Date.now() - m.createdTimestamp >= (14 * 24 * 60 * 60 * 1000)).size,
            messagesToClear = clear - oldMessages;
        message.reply(`${client.user.username} - Pergunta \n Você quer que eu tente limpar ${clear} mensagens?`).then(reag => {
            reag.react('✅')
            reag.react('❌')

            const filter = (reaction, user) => {
                return reaction.emoji.name === '✅' && user.id === message.author.id
            };

            const collector = reag.createReactionCollector({filter: filter, time: 15000});

            collector.on('collect', (reaction, user) => {
                message.channel.send(`Limpei ${args[0]} mensagens com sucesso!`)
                deleteMessages(message, clear)
            })
            const filter2 = (reaction, user) => {
                return reaction.emoji.name === '❌' && user.id === message.author.id
            };

            const collector2 = reag.createReactionCollector({filter: filter2, time: 15000});

            collector2.on('collect', (reaction, user) => {
                reag.delete()
                message.channel.send(`${client.user.username} - Sucesso \n Você rejeitou a limpa!`)
            });

        })
    }
}
function deleteMessages(message, totalAmount) {
    const interval = setInterval(async () => {
      if (totalAmount <= 1) {
        message.reply('Canal limpo!')
        return clearInterval(interval)
      }
  
      message.channel.bulkDelete(totalAmount > 100 ? 100 : totalAmount, true)
      totalAmount -= 100
    }, 5000) // 5 segundos deve ser suficiente (não tenho a certeza, não conheço os ratelimits)  
  }