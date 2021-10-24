const  { MessageEmbed, MessageAttachment } = require('discord.js')
const path = require('path');
const Canvas = require('canvas')
const { registerFont } = require('canvas');

module.exports = {
    config: {
        nome: 'ship',
        cooldown: 10
        
    },
    run: async(client, message, args) => {
    if(message.isCommand) return message.reply('Esse comando não funciona com slash commands!')
    let autor = message.mentions.members.toArray()[0]?.user
    let mencao = message.mentions.members.toArray()[1]?.user
        if(!autor) return message.reply({content: 'Mencione o 1° membro'})
        if(!mencao) return message.reply({content: 'Mencione o 2° membro'})
    const canvas = Canvas.createCanvas(1000, 333);
    const ctx = canvas.getContext('2d');
    registerFont('./src/Canvas/Gotham-Black.otf', {family: 'Gotham-Black'});
const applyText = (canvas, text) => {

    let fontSize = 65;

    do {
        ctx.font = `${fontSize -= 10}px Gotham-Black`;
    } while (ctx.measureText(text).width > canvas.width - 300);
    return ctx.font;
};
const background = await Canvas.loadImage(String(path.resolve(__dirname,'..', '..', 'Canvas', 'heart.png')));
ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
ctx.strokeStyle = '#ffffff';
ctx.strokeRect(0, 0, canvas.width, canvas.height);
const avatar = await Canvas.loadImage(mencao.displayAvatarURL({format: 'png'}));
const avatar2 = await Canvas.loadImage(autor.displayAvatarURL({format: 'png'}));
const random = Math.floor(Math.random() * 100);
ctx.font = applyText(canvas, random);
ctx.fillStyle = '#ffffff';
ctx.fillText(`${random}%`, canvas.width / 2.2, canvas.height / 1.9);
ctx.drawImage(avatar, 161, 89, 145, 145);
ctx.drawImage(avatar2, 725, 89, 145, 145);
const attachment = new MessageAttachment(canvas.toBuffer(), 'heart.png');

function progressBar(amount, length) {
    response = "█".repeat(amount) + ".".repeat(length - amount)
    return response;
}

let barra = progressBar(random, random)
if(random >= 10 && random <= 67 ) {
    const embed = new MessageEmbed()
        .setColor('#9900f8')
        .addField(`${client.user.username} - Diversão`, `Será que \`${autor.username}\` e \`${mencao.username}\` se amam? \n ${barra} ${random}% \n Quuuase se amando mais ainda não é grande!`)
        .attachFiles(attachment)
        .setImage('attachment://heart.png')
    message.reply({embeds: [embed]})
} else if(random >= 67) {
    const embed = new MessageEmbed()
        .setColor('#9900f8')
        .addField(`${client.user.username} - Diversão`, `Será que \`${autor.username}\` e \`${mencao.username}\` se amam? \n ${barra} ${random}% \n Sim SIM SIM! PERFEITOOOOOOOO!`)
        .setImage('attachment://heart.png')
        message.reply({embeds: [embed], files: attachment})
}
}

}