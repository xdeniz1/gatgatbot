const db = require('quick.db')
const Discord = require('discord.js')
const client = new Discord.Client();

exports.run = async (bot, message, args) => {
  db.set(`premium`, 'aktif')
      message.channel.send(new Discord.RichEmbed()
                           .setDescription('✅ | Kullanıcılar Artık Premium Alabilir!!')
                           .setColor('RANDOM')
                          )

}
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 4
};

exports.help = {
  name: 'premium-aktif',
  description: '[Admin Komutu]',
  usage: 'reklam-engelleme'
};