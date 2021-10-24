const Discord = require('discord.js')
const parseMilliseconds = require('parse-ms');
const db = require('./db.js')
const colors = require('colors');
const { Client, Collection, Message, APIMessage, Intents } = require('discord.js')
const { DiscordTogether } = require('discord-together');
const { tokenc, tokenAPI, token } = require("./config.json")
const DBL = require('top.gg');
const dbl = new DBL(tokenAPI, { webhookPort: 25685, webhookAuth: 'michaeljacksu' });
const client = new Client({
    shardId: process.argv[1],
    shardCount: process.argv[2],
    fetchAllMembers: true,
    intents: 32767,
    ws: {
    properties: {
        $browser: "Discord iOS"
    }
}
});
dbl.webhook.on('ready', hook => {
  console.log(`[WEBHOOK TOP.GG] Web hook logado! no ip ${hook.hostname} e na porta ${hook.port}`.green);
});
dbl.webhook.on('vote', async vote => {
   const find = await db.coins.findOne({id: vote.user})
   !find ? await db.coins.create({id: vote.user, coinsc: 5000, coinsb: 0}):await db.coins.findOneAndUpdate({id: vote.user}, {coinsc: find.coinsc + 5000})
   client.users.cache.get(vote.user).send('Detectamos que você fez 1 voto na top.gg! Serio obrigado mesmo. E você acaba de receber 5K de koins!').catch(error => {
       console.log('Um erro ocorreu ao anunciar para o ' + client.users.cache.get(vote.user).username)
   })
   client.channels.cache.get('821013595822620673').send(`O membro ${client.users.cache.get(vote.user).username} votou na top.gg e recebe 5K de koins! Quer essa quantia tambem? Então vote na top.gg! https://top.gg/bot/750384014388494376 !`)
});
['commands', 'aliases'].forEach(f => client[f] = new Collection());
['comandos', 'eventos'].forEach(f => require(`./src/handlers/${f}`)(client));
client.discordTogether = new DiscordTogether(client);
client.login(token);