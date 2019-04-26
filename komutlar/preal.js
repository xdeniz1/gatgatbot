let Discord = require('discord.js')

exports.run = async(client, message) => {

  const db = require('quick.db')  
  db.fetch(`premium`).then(i => {
    if (i == 'deaktif') {
    return message.reply(':x: **| Hey Dostum Premium Sistemi Şu Anda Kapalı !**')
    }  
    db.fetch(`kullanim_${message.author.id}`).then(i => {
    if (i == 'aktif') {
    return message.reply(':x: **| Hey Dostum Bu Komutu **:D** Sürede Bir Kullanabilirsin !**')
    }
  
  let premiummesaj = [ ':white_check_mark: | Hey Premiumun Hazır ,\n Reklamı Geçerek Ulaşabilirsin : `http://link.tl/1YeJ9`'
] 

        var random = Math.floor(Math.random()*(premiummesaj.length-0+1)+0);
        message.channel.send(new Discord.RichEmbed()
         .addField('Özel Mesajlarını Kontrol Et ! :postbox: ','Premium Generator')
        .setColor('RANDOM')
)
        message.author.send(premiummesaj[random])
        db.set(`kullanim_${message.author.id}`, 'aktif')
  })})}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'preal',
  description: 'Avatarınıza Triggered Efekti Verir.',
  usage: 'triggered veya triggered <@kullanıcı>'
};