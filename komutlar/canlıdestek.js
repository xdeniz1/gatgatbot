const Discord = require('discord.js');

exports.run = async(client, message, args) => {
   
  let isEnabled;
  message.channel.send(`Birazdan yetkili ekibimiz sizinle ilgilenecektir.`);
  let chan = message.channel;
  let destekKanal = "525341807161114637";
  const embed = new Discord.RichEmbed()
      .addField('Dikkat', `Canlı Destek Talebi`)
      .setColor("BLUE")
      .addField(`Bilgiler`, `Sunucu: ${message.guild.name} \n Kanal: ${message.channel.name} \n Destek İsteyen: ${message.author.tag}`)
      .setFooter("GoktugBot | Canlı Destek")
  client.channels.get(destekKanal).send(embed);
  const collector = client.channels.get(destekKanal).createCollector(message => message.content.startsWith(''), {
    time: 0
  })
  client.channels.get(destekKanal).send(`Destek çağrısına bağlanmak için \`bağlan\`, iptal etmek için \`iptal\` yazınız.`)
  collector.on('message', (message) => {
    if (message.content === 'iptal') collector.stop('aborted')
    if (message.content === 'bağlan') collector.stop('success')
  })
  collector.on('end', (collected, reason) => {
    if (reason === 'time') return message.channel.send(`Canlı destek talebiniz zaman aşımına uğradı.`)
    if (reason === 'aborted') {
      message.channel.send(`Canlı destek talebiniz yetkili tarafından reddedildi.`)
      client.channels.get(destekKanal).send(`Canlı destek talebi reddedildi.`)
    }
    if (reason === 'success') {
      client.channels.get(destekKanal).send(`Canlı destek talebi kabul edildi. İptal etmek için \`iptal\` yazınız.`)
      chan.send(`${message.author}, canlı destek talebiniz yetkili tarafından kabul edildi. İptal etmek için \`iptal\` yazınız.`)
      isEnabled = true
      client.on('message', message => {
        function contact() {
          if (isEnabled === false) return
          if (message.author.id === client.user.id) return
          if (message.content.startsWith('iptal')) {
            message.channel.send(`Canlı destek talebini iptal ettiniz.`)
            if (message.channel.id === chan.id)
              client.channels.get(destekKanal).send(`Canlı destek talebi kullanıcı tarafından iptal edildi.`)
            if (message.channel.id === destekKanal) 
              chan.send(`Canlı destek talebiniz yetkili tarafından iptal edildi.`)
            return isEnabled = false
          }
          if (message.channel.id === chan.id) 
            client.channels.get(destekKanal).send(`Talepte Bulunan Kişi : ${message.author.tag} : ${message.content}`)
          if (message.channel.id === destekKanal) 
            chan.send(`Yetkili : ${message.author.tag} : ${message.content}`)
        }
        contact(client)
      })
    }
  })
}

  exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'canlıdestek',
  description: 'Yetkililerle canlı desteğe geçersiniz.',
  usage: 'canlıdestek'
};
 