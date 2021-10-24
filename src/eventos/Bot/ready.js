const db = require('../../../db')
require('colors')
module.exports = async (client) => {
  console.log(`\n[CLIENT] O bot ${client.user.tag} foi ligado com sucesso!\n`.cyan)
  setInterval(() => {
    const status = [
      {
        type: 'STREAMING',
        message: 'Obrigado por ter a Kinny em seu servidor!',
        url: 'https://www.twitch.tv/sla'
      },
      {
        type: 'WATCHING',
        message: `Agora eu estou em ${client.guilds.cache.size} servidores!`,
        url: 'https://www.twitch.tv/sla'
      },
    ]
    const random = status[Math.floor(Math.random() * status.length)];
    client.user.setActivity(random.message, { type: random.type, url: random.url, browser: 'Discord IOS' });
  }, 6000)
  client.commands.forEach(async comandos => {
    if (comandos.config.categoria === 'developer' && comandos.config.categoria === 'jornalismo') return;
    const data = {
      name: comandos.config.nome,
      description: !comandos.config.descricao ? "Sem descrição" : comandos.config.descricao,
    };
    if (comandos.config.options) {
      data.options = comandos.config.options
    }
    client.application?.commands.create(data).catch(async error => {
        console.log(`[SLASH COMMANDS] Um erro aconteceu ao tentar criar slash commands! Erro: ${error.message}`.red)
    })
  })
  console.log('[SLASH COMMANDS] Slash commands iniciado com sucesso (Lembrando que pode demorar 1 hora)'.green)
    let cmds = await client.application?.commands.fetch()
    let count = 0
    cmds.forEach(cm => {
        if(client.commands.find(x => x.config.nome === cm.name)) return;
        client.application?.commands.delete(cm.id)
    })
}