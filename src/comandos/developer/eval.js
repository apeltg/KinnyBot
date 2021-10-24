const {token} = require('../../../config.json')
const { inspect } = require('util')
const config = require('../../../config.json')
const { MessageEmbed } = require('discord.js')
const db = require('../../../db')
module.exports = {
    config: {
        nome: 'eval'
    },
    run: async (client, message, args) => {
        if (!['395995293436477442', '425775842371829760', '719986033583849502', '862860827584888853'].includes(!message.author ? message.user.id:message.author.id)) {
            return message.reply('Que lindo né? Tentando usar meu eval, só meu dono pode usar!')
        }
            const input = args.join(" ");
            if(!input) return message.reply({content: `${client.user.username} - Erro \n Adicione algo!`})
            try {
                let output = await eval(input);
                return message.reply(`Resultado: \`\`\`js\n${inspect(output, {depth: 0})}\`\`\` \nTipo: \`\`\`js\n${typeof(output)}\`\`\``)
            } catch(e) {
              return message.reply("Erro: "+e)
            }

        }
    }