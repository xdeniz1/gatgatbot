const Discord = require('discord.js');
var ayarlar = require('../ayarlar.json');

exports.run = (client, message) => {
  
/*var helpers = "";
    for (var i = 0; i < ayarlar.helper.length; i++) {
        var şuanki = client.users.get(ayarlar.helper[i]).tag;
        if (i === 0) {
            helpers += şuanki
        }
        else if (i === ayarlar.helper.length - 1) {
            helpers += ", " + şuanki;
        } else {
            helpers += ", " + şuanki
        }
    }*/
  
        const embed = new Discord.RichEmbed()
		.setColor("RANDOM")
		.addField(`» Botun İsmi/Adı:`, `Goktug | Bot`)
		.addField(`» Botun Sahibi/Yapımcısı:`, `<@${ayarlar.adminID}>`)
    .addField(`» Kodlamada Yardımcı Olanlar:`, `<@${ayarlar.adminID}>`)
    .addField(`» Botun Orjinal Prefixi/Ön-Eki:`, `${ayarlar.prefix}`)
    .addField(`» NezleNW | Bot | Destek Sistemi Kurulumu:`, `1- **Ücretli !**`)
		.addField(`» Botun Linkleri:`, `[Botu Sunucuna Eklemek İçin Tıkla!](https://discordapp.com/oauth2/authorize?client_id=491624639957696512&scope=bot&permissions=2146958847) \n[Botun Destek Sunucusuna Gelmek İçin Tıkla](https://discord.gg/ygazTSf)`)
    .setFooter('© ' + (new Date()).getFullYear() + ' Goktug | Bot')
		.setThumbnail(client.user.avatarURL)
        message.channel.send({embed});
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['hakkında'],
    permLevel: `Yetki gerekmiyor.`
  };
  
  exports.help = {
    name: 'bilgi',
    category: 'bot',
    description: 'Botun bilgisini gösterir.',
  };