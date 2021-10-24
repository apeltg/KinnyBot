const db = require('../../../db')
const { MessageEmbed } = require('discord.js')


module.exports = async(client, interaction) => {
    if (!interaction.isCommand()) return;
    const comandoInfo = client.commands.get(interaction.commandName) || client.commands.get(client.aliases.get(interaction.commandName))
	if (comandoInfo) {
      if(await db.ban.findOne({punid: interaction.user.id})) {
        return interaction.reply(`Olá! Se você está lendo essa mensagem no exato momento que executou um comando meu é porque você foi banido! \n \nMotivo: ${!(await db.ban.findOne({punid: interaction.user.id})).motivo.length ? "Sem motivo":(await db.ban.findOne({punid: interaction.user.id})).motivo} \n \nHi! If you're reading this message at the exact moment you ran a command from me, it's because you've been banned! \n \nReason: ${!(await db.ban.findOne({punid: interaction.user.id})).motivo.length ? "Sem motivo":(await db.ban.findOne({punid: message.author.id})).motivo}`)
      }
            if(!interaction.member.permissions.has('ADMINISTRATOR')) {
          let channel = await db.can.findOne({groupid: interaction.guild.id})
       if(channel && interaction.channel.id !== channel.channel) return interaction.reply(`Esse comando so pode ser executado em <#${channel.channel}>`)
      }
		let args = []
        if(comandoInfo.config.categoria === 'dev' && interaction.user.id !== '425775842371829760') return message.reply({content: 'Você não pode acessar esse conteudo!', ephemeral: true})
         if(comandoInfo.config.categoria === 'jornalismo') return interaction.reply('Essa categoria não funciona com slash commands!')
		comandoInfo.run(client, interaction, args).catch(error => {
             const embed = new MessageEmbed()
             .setTitle('Um erro ocorreu ao tentar executar um comando')
             .setDescription(`Comando ${interaction.commandName} \nSlash? Sim \nErro: ${error.message} \nAutor: ${interaction.user.username}`)

             client.channels.cache.get('873719017616068638').send({embeds: [embed]})
        })
	}
}