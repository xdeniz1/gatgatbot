const Discord = require('discord.js');
const client = new Discord.Client();
const ayarlar = require('../ayarlar.json');

exports.run = (client, message) => {
  const embed = new Discord.RichEmbed()
  .setTitle("Beni sunucuna davet etmek için tıkla.")
    .setAuthor(message.author.username, message.author.avatarURL)
  .setColor("RANDOM")
  .setDescription("**Bot yapımıcısı:** goktug#3131")
  .setFooter('GoktugBot', client.user.avatarURL)
  .setThumbnail("")
  .addField("» Linkler", `[Botu Ekle](https://discordapp.com/oauth2/authorize?client_id=491624639957696512&scope=bot&permissions=1073217023)`+ "**\n**"+`[Destek Sunucusu](https://discord.gg/ygazTSf)`, false)
  .setURL('https://discordapp.com/oauth2/authorize?client_id=491624639957696512&scope=bot&permissions=1073217023')
  .setThumbnail(client.user.avatarURL);

  message.channel.send({embed});
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'davet',
  aciklama: 'Bot ile ilgili bilgi verir.',
  kullanim: 'davet'
};