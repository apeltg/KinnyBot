const axios = require('axios')
const { MessageEmbed } = require('discord.js')
module.exports = {
    config: {
        nome: 'cnpj',
        cooldown: 3
    },
    run: async(client, message, args) => {
        let motivo1 = args.join(" ")
        if(!['425775842371829760', '401024028388884483'].some(x => (!message.author ? message.user.id:message.author.id).includes(x))) {
            message.reply({content: 'Apenas meu desenvolvedor pode executar esse comando!'})
        } else {
            if(!motivo1) return message.reply('Digite o CNPJ!')
            let cnpj = await axios.get(`https://brasilapi.com.br/api/cnpj/v1/${motivo1.replace('/', '')}`)
            if(cnpj.status === 404) return message.reply('Não existe o CNPJ!')
            
            const embed = new MessageEmbed()
            .setTitle('CNPJ')
            .setDescription(`\nRazão social: ${cnpj.data.razao_social} \nNome fantasia: ${cnpj.data.nome_fantasia} \nSituação: ${cnpj.data.descricao_situacao_cadastral} \nUF: ${cnpj.data.uf}\nPorte: ${cnpj.data.descricao_porte}\n`)
            
            message.reply({embeds: [embed]})
        }
    }
}