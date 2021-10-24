const { MessageEmbed } = require('discord.js')

module.exports = {
    config: {
        nome: 'aikar',
        aliases: ['aikarflags', 'aikarflag']
    },
    run: async (client, message) => {
        const per = ['Qual é a jar do servidor?', 'O servidor usa pterodactyl? (Sim/não)', 'Quantos gigas tem seu servidor? (Coloque GB ou MB na frente!)', 'Qual versão do seu java?']
        const re = []
        const collector = message.channel.createMessageCollector({filter: ({ author }) => author.id === (!message.author ? message.user.id : message.author.id), max: per.length})
        const embed = new MessageEmbed()
            .setColor('#9900f8')
            .setTitle(`${client.user.username} - Aikar Flags`)
            .setDescription(per[0])
        message.reply({embeds: [embed]})
        collector.on('collect', async (m) => {
            re.push(m.content.toLowerCase())
            if(re.length === per.length) return collector.stop()
            const embed = new MessageEmbed()
                .setColor('#9900f8')
                .setTitle(`${client.user.username} - Aikar Flags`)
                .setDescription(per[re.length])
            message.channel.send({embeds: [embed]})

        })
        collector.on('end', (colleted) => {
            if(!/(gb|mb)/ig.test(re[2].toLowerCase())) {
                return message.reply('Isso não inclui GB/MB!')
            }
            if(isNaN(re[2].replace(/(gb|mb)/ig, '').trim())) {
                return message.reply('Você não respondeu corretamente a pergunta "Quantos gigas tem seu servidor? (Coloque GB ou MB na frente!)"!')
            }
            if(!/(sim|nao)/ig.test(re[1].normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) {
                return message.reply('Você não respondeu corretamente a pergunta "O servidor usa pterodactyl?"!')
            }
            if(isNaN(re[3].replace(/(gb|mb)/ig, '').trim())) {
                return message.reply('Você não respondeu corretamente a pergunta "Qual versão do seu java?"!')
            }
            let str = re[2].replace(/[0-9]/g, '').replace('b', '').trim().toUpperCase()
            const embed = new MessageEmbed()
                .setColor('#9900f8')
                .setTitle(`${client.user.username} - Aikar Flags`)
                .setDescription(`Sua aikar flags está pronta! \n \n\`java -Xms${re[1] === 'sim' && str === 'G' ? Number(re[2]) - 1 === 0 ? Number(re[2].replace(/(gb|mb)/ig, '').trim()):Number(re[2].replace(/(gb|mb)/ig, '').trim()) - 1:re[2].replace(/(gb|mb)/ig, '').trim()}${str} -Xmx${re[1] === 'sim' && str === 'G' ? Number(re[2].replace(/(gb|mb)/ig, '').trim()) - 1 === 0 ? Number(re[2].replace(/(gb|mb)/ig, '').trim()):Number(re[2].replace(/(gb|mb)/ig, '').trim()) - 1:re[2].replace(/(gb|mb)/ig, '').trim()}${str} -XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200 -XX:+UnlockExperimentalVMOptions -XX:+DisableExplicitGC -XX:+AlwaysPreTouch -XX:G1HeapWastePercent=5 -XX:G1MixedGCCountTarget=4 -XX:G1MixedGCLiveThresholdPercent=90 -XX:G1RSetUpdatingPauseTimePercent=5 -XX:SurvivorRatio=32 -XX:+PerfDisableSharedMem -XX:MaxTenuringThreshold=1 -XX:G1NewSizePercent=${Number(re[2].replace(/(gb|mb)/ig, '').trim()) <= 12 ? 30:40} -XX:G1MaxNewSizePercent=${Number(re[2].replace(/(gb|mb)/ig, '').trim()) <= 12 ? 40:50} -XX:G1HeapRegionSize=${Number(re[2].replace(/(gb|mb)/ig, '').trim()) <= 12 ? 8:16}M -XX:G1ReservePercent=${Number(re[2].replace(/(gb|mb)/ig, '').trim()) <= 12 ? 20:15} -XX:InitiatingHeapOccupancyPercent=${Number(re[2].replace(/(gb|mb)/ig, '').trim()) <= 12 ? 15:20} ${Number(re[3]) >= 11 ? '-Xlog:gc*:logs/gc.log:time,uptime:filecount=5,filesize=1M':'-Xloggc:gc.log -verbose:gc -XX:+PrintGCDetails -XX:+PrintGCDateStamps -XX:+PrintGCTimeStamps -XX:+UseGCLogFileRotation -XX:NumberOfGCLogFiles=5 -XX:GCLogFileSize=1M'} -Dusing.aikars.flags=https://mcflags.emc.gs -Daikars.new.flags=true -jar ${re[0].replace('.jar', '')}.jar ${Number(re[3]) >= 11 ? '':'nogui'}\``)
            message.channel.send({embeds: [embed]})
        })
    }
}