const Discord = require('discord.js');

 exports.run = (client, message, args) => {
   if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply(`Bu komutu kullanabilmek için  iznine sahip olmalısın!`);
   message.delete();

   let question = args.join(' ');

   let user = message.author.username

   if (!question) return message.channel.sendEmbed(

     new Discord.RichEmbed()

     .addField(`Yazı yazman gerek `)).then(m => m.delete(5000));

     console.log("!!!oylama komutu " + message.author.username + '#' + message.author.discriminator + " tarafından kullanıldı.")
     message.channel.sendEmbed(

       new Discord.RichEmbed()

       .setColor("RANDOM")

   .addField(`GoktugBot Oylama Sistemi '✅''❌' `,`**${question}**`)).then(function(message) {
        
       message.react('✅');

         message.react('❌');

       });

     };

     exports.conf = {
       enabled: true,
       guildOnly: false,
       aliases: ['oylama'],
       kategori:"sunucu",
      permLevel: 0
  
};

exports.help = {
  name: 'oylama',
  aciklama: 'Oylama Açar.',
  kullanim: 'oylama'
};