const Discord = require('discord.js');
const client = new Discord.Client();
const db = require('quick.db');
const ayarlar = require('./ayarlar.json');
const chalk = require('chalk');
const YouTube = require('simple-youtube-api');
const youtube = new YouTube('AIzaSyCRJ5dT8mNYmfOlXEEjyPK6KXSpC7EBRj8');
const ytdl = require('ytdl-core');
const http = require('http');
const express = require('express')
const app = express();
const fs = require("fs");
const queue = new Map();
const moment = require('moment');
const economy = require('discord-eco');
const Jimp = require('jimp');

require('./util/eventLoader')(client);

var prefix = ayarlar.prefix;

const log = message => {
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);
};


require("http").createServer(async (req,res) => { res.statusCode = 200; res.write("ok"); res.end(); }).listen(3000, () => console.log("Now listening on port 3000"));

 



client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./komutlar/', (err, files) => {
  if (err) console.error(err);
  console.log(`<${files.length}> komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    console.log(`>>> Yüklenen komut: ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});



client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};


client.elevation = message => {
  if(!message.guild) {
	return; }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === ayarlar.adminID) permlvl = 4;
  return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;

client.on('warn', e => {
  console.log(chalk.bgYellow(e.replace(regToken, 'that was redacted')));
});

client.on('error', e => {
  console.log(chalk.bgRed(e.replace(regToken, 'that was redacted')));
});
client.on('message' , msg => {
   if (msg.content.toLowerCase() === prefix + "yetkili") {
        const embed = new Discord.RichEmbed()
            .addField("  🔨 Yetkili Yardım ⚙", "Yetkililerin Kullanacağı Komutlar")
                    .addField("!!!sa-as <aç>/<kapat>", "Sunucunuzda Otomatik Selam Verme .")
    
           .addField("!!!ban <isim> <sebep>", "Kullanıcıyı Sunucudan Yasaklar.")
            .addField("!!!kick <isim> <sebep>", "Kullanıcıyı Sunucudan Atar.")
            .addField("!!!uyar"               , "Belirlediğin Kullanıcıyı Uyarır : `mod-log`")
            .addField("!!!mute <isim> <sebep>", "Belirlediğiniz Kullanıcıya Konuşma Yasağı Getirir Süreli.")
            .addField("!!!takmaad <isim>", "GoktugBot'un Kullanıcını Adını Değiştirir.")
            .addField("!!!kurulum", "GoktugBot ile ilgili Tüm Metin Kanallarını Otomatik Şekilde Oluşturur.")
            .addField("!!!otorol <rol> <kanal>",  "Kullanıcıların Sunucunuza Girdiğinde Hangi Rolü Verileceğini Belirlersiniz")
            .addField("!!!otorolkapat", "Oto Rol Özelliğini Kapatırsınız.")
            .addField("!!!otorolmsgkapat", "Oto Rol'den Gelen Mesajları Kapatırsınız.")
            .addField("!!!reklamtaraması", "Sunucudaki Kullanıcıların Oynuyor Kısmında Reklam Arar.")
            .addField("!!!temizle", "Sunudaki Sohbet'i Temizler")
            .addField("!!!yavaşmod", "Konuşma Kanallarındaki Yazma Süresini Ayarlar.")
            .addField("!!!otorolkapat", "Oto Rol Özelliğini Kapatırsınız.")
          
            
            .setColor("38C941")
        
        return msg.channel.sendEmbed(embed)
    }
  });

client.on('message' , msg => {
   if (msg.content.toLowerCase() === prefix + "müzik") {
        const embed = new Discord.RichEmbed()
            .addField(" 🎶🎶🎶 Müzik Komutları 🎶🎶🎶", "Yetkililerin Kullanacağı Komutlar")
            .addField("!!!çal <isim>/<link>", "Şarkı Çalar")
            .addField("!!!durdur", "Şarkı Çalıyorsa Durdurur.")
            .addField("!!!geç"               , "Eğer Şarkı Listesinde 1'den Fazla Şarkı Varsa Şarkıları Atlayabilirsin.")
            .addField("!!!ses", "Müziğin Ses Seviyesini Değiştirebilirsin.")
            .addField("!!!oynatılan <isim> <sebep>", "Belirlediğiniz Kullanıcıya Konuşma Yasağı Getirir Süreli.")
            .addField("!!!dur", "Çalan Şarkıyı Duraklatır.")
            .addField("!!!devamet", "Duraklatılmış Şarkıyı Devam Eder")
            .addField("!!!liste", "Sıraya Eklenmiş Şarkıları Gösterir.")
            .addField("!!!devam", "GoktugBot'un Kullanıcını Adını Değiştirir.")
            .addField("!!!çalan", "GoktugBot'un Kullanıcını Adını Değiştirir.")


            
            .setColor("RANDOM")
        
        return msg.channel.sendEmbed(embed)
    }
  });

client.on('message' , msg => {
   if (msg.content.toLowerCase() === prefix + "minecraft") {
        const embed = new Discord.RichEmbed()
            .addField(" ◢◤◢◤ Minecraft Komutları ◢◤◢◤", "Minecraft Komutları")
            .addField(" ￼ ￼￼ ￼ ￼ ￼ ￼ ￼￼ ￼ ￼ ￼"," ￼￼ ￼")
            .addField("!!!mcskin <KULLANICI>", "Minecraft Oyuncusunun Cildini Gösterir.")
            .addField("!!!mchead <KULLANICI>", "Minecraft Oyuncusunun Kafasını Gösterir.")
            .addField("!!!mccombo <KULLANICI>", "Minecraft Oyuncusunun Cbomo Oluşumunu Gösterir.")
          
       
            
            .setColor("RANDOM")
        
        return msg.channel.sendEmbed(embed)
    }
  });

client.on('message' , msg => {
   if (msg.content.toLowerCase() === prefix + "eğlence") {
        const embed = new Discord.RichEmbed()
            .addField(" ◢◤◢◤ Eğlence Yardım ◢◤◢◤", "Eğlence Komutları")
            .addField(" ￼ ￼￼ ￼ ￼ ￼ ￼ ￼￼ ￼ ￼ ￼"," ￼￼ ￼")
            .addField("!!!alkolölçer", "Alkol Oranınızı Ölçer.")
            .addField("!!!ascii <YAZI>", "ASCİİ Fontunda Yazı Yazar.")
            .addField("!!!atasözü", "Atasözü Söyler .")
            .addField("!!!atatürkçerçeve", "Profil Fotoğrafınıza Atatürkün Çerçevesini Ekler.")
            .addField("!!!avatar <KULLANICI>", "Profil Fotoğrafınızı Gösterir.")
            .addField("!!!duello <KULLANICI>", "Arkadaşlarınızla Oynayabileceğiniz En Gelişmiş Komut.")
            .addField("!!!espri", "Espri Yapar.")
            .addField("!!!hesapla <SAYI>", "Alkol Oranınızı Ölçer.")
            .addField("!!!kaçcm", ":D")
            .addField("!!!minecraft", "Minecraft Komutlarını Gösterir..")
            .addField("!!!mesajdöndür", "Yazdığınız Mesajı Tersine Dönerir.")
            .addField("!!!nitroefekt", "Avatarınıza Nitro Efektini Ekler.")
            .addField("!!!pixel", "Avatarınıza Pixel Efektini Ekler.")
            .addField("!!!saat", "Türkiye'nin Saatini Gösterir.")
            .addField("!!!slot", "Slot Oyunu  Oynarsınız.")
            .addField("!!!stresçarkı", "Stres Çarkı Çevirirsiniz.")
            .addField("!!!söv", "Belirttiğin Kullanıcıya Hakaret Eder")
            .addField("!!!taskagitmakas", "Yapay Zeka İle Taş Kağıt Makas Oynarsınız.")
            .addField("!!!öp", "Belirttiğin Kullanıcıyı Öpersin.")
        
            
            .setColor("RANDOM")
        
        return msg.channel.sendEmbed(embed)
    }
  });


const snekfetch = require('snekfetch');
let points = JSON.parse(fs.readFileSync('./seviye.json', 'utf8'));

var f = [];
function factorial (n) {
  if (n == 0 || n == 1)
    return 1;
  if (f[n] > 0)
    return f[n];
  return f[n] = factorial(n-1) * n;
};
function clean(text) {
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
      return text;
}

client.on("message", async message => {
    if (message.channel.type === "dm") return;

  if (message.author.bot) return;

  var user = message.mentions.users.first() || message.author;
  if (!message.guild) user = message.author;

  if (!points[user.id]) points[user.id] = {
    points: 0,
    level: 0,
  };

  let userData = points[user.id];
  userData.points++;

  let curLevel = Math.floor(0.1 * Math.sqrt(userData.points));
  if (curLevel > userData.level) {
    userData.level = curLevel;
        var user = message.mentions.users.first() || message.author;
message.channel.send(`🆙 **| ${user.username} Tebrikler! Level atladın**`)
    }

fs.writeFile('./seviye.json', JSON.stringify(points), (err) => {
    if (err) console.error(err)
  })

  if (message.content.toLowerCase() === prefix + 'level' || message.content.toLowerCase() === prefix + 'profil') {
const level = new Discord.RichEmbed().setTitle(`${user.username}`).setDescription(`**Seviye:** ${userData.level}\n**EXP:** ${userData.points}`).setColor("RANDOM").setFooter(``).setThumbnail(user.avatarURL)
message.channel.send(`📝 **| ${user.username} Adlı Kullanıcının Profili Burada!**`)
message.channel.send(level)
  }
});

client.on("guildCreate", async guild => {
  const invite = await guild.channels.first().createInvite({
    maxAge: 0
  });
  console.log(`YENİ BİR SUNUCUYA KATILDIM : ${guild.name} with invite :/${invite.code}`)
});


client.on('guildCreate', guild => {
  guild.owner.send(`**Beni Eklediğin İçin Teşekkürler** \n **Komutlarıma !!!yardım Yazarak Bakabilirsiniz.** \n**Discord Sunucuma Gitmek İçin Link \n https://is.gd/p8wyII** `)
})






client.login(ayarlar.token);

client.on('message', async msg => {
  if (msg.content.toLowerCase() === 'adamsın') {
    await msg.react('🇦');
    await msg.react('🇩');
    await msg.react('🅰');
    await msg.react('🇲');
  }
});


client.on("message", message => {
    if (message.content.toLowerCase() === prefix + 'reset') {
    if (message.author.id !== "297457504328220673") {
      message.reply('Bu Komutu Sadece Sahibim Kullanabilir!!!');
      } else {
      message.channel.sendMessage(`Yenileniyorum Yiğenim!!!`).then(msg => {
      console.log(`Yeniden Başlıyorum`);
      process.exit(0);
    })
   }
  }
});

client.on('message', async msg => {
  if (msg.content.toLowerCase() === 'sa') {
   await msg.react('🇸');
    await msg.react('🇦');
  }
});

client.on("guildMemberRemove", async member => {
  const channel = member.guild.channels.find('name', 'giriş-log');//log ismini ayarlıyacaksınız log adında kanal açın
  if (!channel) return;
        let username = member.user.username;
        if (channel === undefined || channel === null) return;
        if (channel.type === "text") {            
                        const bg = await Jimp.read("https://cdn.discordapp.com/attachments/450693709076365323/473184546477572107/guildRemove.png");
            const userimg = await Jimp.read(member.user.avatarURL);
            var font;
            if (member.user.tag.length < 10) font = await Jimp.loadFont(Jimp.FONT_SANS_128_WHITE);
            else if (member.user.tag.length > 10) font = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE);
            else font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
            await bg.print(font, 430, 170, member.user.tag);
            await userimg.resize(362, 362);
            await bg.composite(userimg, 43, 26).write("./img/"+ member.id + ".png");
              setTimeout(function () {
                    channel.send(new Discord.Attachment("./img/" + member.id + ".png"));
              }, 1000);
              setTimeout(function () {
                fs.unlink("./img/" + member.id + ".png");
              }, 10000);
        }
    })

client.on("guildMemberAdd", async member => {
  const channel = member.guild.channels.find('name', 'log');//log ismini ayarlıyacaksınız log adında kanal açın
  if (!channel) return;
        let username = member.user.username;
        if (channel === undefined || channel === null) return;
        if (channel.type === "text") {
            const bg = await Jimp.read("https://cdn.discordapp.com/attachments/450693709076365323/473184528148725780/guildAdd.png");
            const userimg = await Jimp.read(member.user.avatarURL);
            var font;
            if (member.user.tag.length < 10) font = await Jimp.loadFont(Jimp.FONT_SANS_128_WHITE);
            else if (member.user.tag.length > 10) font = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE);
            else font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
            await bg.print(font, 430, 170, member.user.tag);
            await userimg.resize(362, 362);
            await bg.composite(userimg, 43, 26).write("./img/"+ member.id + ".png");
              setTimeout(function () {
                    channel.send(new Discord.Attachment("./img/" + member.id + ".png"));
              }, 1000);
              setTimeout(function () {
                fs.unlink("./img/" + member.id + ".png");
              }, 10000);
        }
    })


client.on('message', message => {
  if (message.content.toLowerCase() === prefix + "şans") {
      var sans = ["💎|💳|⌛ - Malesef Kaybettin Be Kanka", "⌛|⌛|💎 - Tüh Be Tekrar Dene", "💳|💎|💳 - Hadi Be Az Kaldı", "💎|💎|💎 - Helal Sana Hepsini Tutturdun", "💎|⌛|⌛ - Az Kaldı Merak Etme", "💳|💳|💳 - Profesyonelsin Dostum", "💎|💳|⌛ - Birdaki Sefere", "⌛|⌛|⌛ - Bu İşte Ustasın Dostum"];
       var sonuc = sans[Math.floor((Math.random() * sans.length))];
    const embed = new Discord.RichEmbed()
    .addField(`***___Şans___***`, `${sonuc}`)
    return message.channel.sendEmbed(embed);
}
});



client.on("message", async message => {
  var user = message.mentions.users.first() || message.author;
    if (message.content.toLowerCase() === prefix + "sniper") {
        var user = message.mentions.users.first() || message.author;
        if (!message.guild) user = message.author;

        message.channel.send("Yapıyorum dostum sakin ol ve bekle....  ⏲").then(m => m.delete(1000));

        Jimp.read(user.avatarURL, (err, image) => {
            image.resize(310, 325)
            image.greyscale()
            image.gaussian(3)
            Jimp.read("https://cdn.glitch.com/b18a2fa6-68cb-49d5-9818-64c50dd0fdab%2FPNGPIX-COM-Crosshair-PNG-Transparent-Image.png?1529363625811", (err, avatar) => {
                avatar.resize(310, 325)
                image.composite(avatar, 2, 0).write(`./img/snip/${client.user.id}-${user.id}.png`);
                setTimeout(function() {
                    message.channel.send(new Discord.Attachment(`./img/snip/${client.user.id}-${user.id}.png`));
                }, 1000);
            });

        });
    }
});
const GIFEncoder = require('gifencoder');

client.on("message", async message => {
  var user = message.mentions.users.first() || message.author;
    if (message.content.toLowerCase() === prefix + "trigger") {
        const options = {
            size: 256,
          
            frames: 16
        }

        message.channel.send("Yapıyorum dostum sakin ol ve bekle.... ⏲").then(m => m.delete(1000));

        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        const args = message.content.split(' ').slice(1);
        let member = message.mentions.users.first()
        if (args[0] === undefined) member = message.author;
        let avatarurl = member.avatarURL;
        if (['jpg', 'jpeg', 'gif', 'png', 'webp'].some(x => args.join(' ').includes(x))) {
            avatarurl = args.join(' ').replace(/gif|webp/g, 'png');
        }
        const base = new Jimp(options.size, options.size);
        const avatar = await Jimp.read(avatarurl);
        const text = await Jimp.read('https://cdn.glitch.com/a7d3b6b8-9b7a-4aab-9ee4-1db0c07ef1eb%2Ftriggered.png?1526842782410');
        const tint = await Jimp.read('https://cdn.glitch.com/5fed2789-b430-43c5-bf1b-a8dd32d46b97%2Fred.png?1527082445373');
        avatar.resize(320, 320);
        tint.scaleToFit(base.bitmap.width, base.bitmap.height);
        tint.opacity(0.2);
        text.scaleToFit(280, 60);
        const frames = [];
        const buffers = [];
        const encoder = new GIFEncoder(options.size, options.size);
        const stream = encoder.createReadStream();
        let temp;

        stream.on('data', async buffer => await buffers.push(buffer));
        stream.on('end', async () => {
            return await message.channel.send({
                files: [{
                    name: 'notechtriggered.gif',
                    attachment: Buffer.concat(buffers)
                }]
            });
        });
        for (let i = 0; i < options.frames; i++) {
            temp = base.clone();
            if (i === 0) {
                temp.composite(avatar, -16, -16);
            } else {
                temp.composite(avatar, -32 + getRandomInt(-16, 16), -32 + getRandomInt(-16, 16));
            }
            temp.composite(tint, 0, 0);
            if (i === 0) temp.composite(text, -10, 200);
            else temp.composite(text, -12 + getRandomInt(-8, 8), 200 + getRandomInt(-0, 12));
            frames.push(temp.bitmap.data);
        }
        encoder.start();
        encoder.setRepeat(0);
        encoder.setDelay(20);
        for (const frame of frames) {
            encoder.addFrame(frame);
        }
        encoder.finish();
    }
})

client.on("guildMemberAdd", async member => {
        let sayac = JSON.parse(fs.readFileSync("./otorol.json", "utf8"));
  let otorole =  JSON.parse(fs.readFileSync("./otorol.json", "utf8"));
      let arole = otorole[member.guild.id].sayi
  let giriscikis = JSON.parse(fs.readFileSync("./otorol.json", "utf8"));  
  let embed = new Discord.RichEmbed()
    .setTitle('Otorol Sistemi')
    .setDescription(`:loudspeaker: :inbox_tray:  @${member.user.tag}'a Otorol Verildi `)
.setColor("GREEN")
    .setFooter("Goktug", client.user.avatarURL);

  if (!giriscikis[member.guild.id].kanal) {
    return;
  }

  try {
    let giriscikiskanalID = giriscikis[member.guild.id].kanal;
    let giriscikiskanali = client.guilds.get(member.guild.id).channels.get(giriscikiskanalID);
    giriscikiskanali.send(` \`${member.user.tag}\`   adlı kullanıcıya rolü verildi .`);
  } catch (e) { // eğer hata olursa bu hatayı öğrenmek için hatayı konsola gönderelim.
    return console.log(e)
  }

});


client.on('message', msg => {
  if (msg.author.bot) return;
  const reason = msg.content.split("!!!destek").slice(1).join("!!!destek");
  if (msg.channel.name== 'destek-sistemi') { 
    if (!msg.guild.roles.exists("name", "Destek Ekibi")) return msg.reply(`Bu sunucuda **Destek Ekibi** isminde bir rol bulamıyorum. \nDestek Sisteminin çalışabilmesi için **Destek Ekibi** isminde bir rol oluşturulmalı!`).then(m2 => {
            m2.delete(5000)});
      msg.guild.createChannel(`destek-${msg.author.username}`, "sadasdasda").then(c => {
      let role = msg.guild.roles.find("name", "Destek Ekibi");
      let role2 = msg.guild.roles.find("name", "@everyone");
      c.overwritePermissions(role, {
          SEND_MESSAGES: true,
          READ_MESSAGES: true
      });
      c.overwritePermissions(role2, {
          SEND_MESSAGES: false,
          READ_MESSAGES: false
      });
      c.overwritePermissions(msg.author, {
          SEND_MESSAGES: true,
          READ_MESSAGES: true
      });

      const embed = new Discord.RichEmbed()
      .setColor("RANDOM")
      .setAuthor(`${client.user.username} | Destek Sistemi`)
      .addField(`Merhaba ${msg.author.username}!`, `Yetkililer burada seninle ilgilenecektir. \nDestek talebini kapatmak için \`${ayarlar.prefix}kapat\` yazabilirsin.`)
      .addField(`» Talep Konusu/Sebebi:`, `${msg.content}`, true)
      .addField(`» Kullanıcı:`, `<@${msg.author.id}>`, true)
      .setFooter(`${client.user.username} | Destek Sistemi`)
      .setTimestamp()
      c.send({ embed: embed })
      c.send(`<@${msg.author.id}> Adlı kullanıcı "\`${msg.content}\`" sebebi ile destek talebi açtı! Lütfen Destek Ekibini bekle, @here`)
      msg.delete()
      }).catch(console.error);
    }
  });
  

client.on("message", msg => {
  
  
  db.fetch(`kufur_${msg.guild.id}`).then(i => {
    if (i == 'acik') {
        const kufur = ["oç", "amk", "ananı sikiyim", "ananıskm", "piç", "amk", "amsk", "sikim", "sikiyim", "orospu çocuğu", "piç kurusu", "kahpe", "orospu", "mal", "sik", "yarrak", "am", "amcık", "amık", "yarram", "sikimi ye", "mk", "mq", "aq", "ak", "amq",];
        if (kufur.some(word => msg.content.includes(word))) {
          try {
            if (!msg.member.hasPermission("BAN_MEMBERS")) {
                  msg.delete();
                          
                      return msg.reply('Bu Sunucuda Küfür Filtresi Aktiftir. Küfür Etmene İzin Veremem !').then(msg => msg.delete(3000));
            }              
          } catch(err) {
            console.log(err);
          }
        }
    }
    else if (i == 'kapali') {  
    }
    if (!i) return;
  })
    });


client.on("message", async msg => {
  const i = await db.fetch(`ssaass_${msg.guild.id}`);
    if (i == 'acik') {
      if (msg.content.toLowerCase() == 'sa' || msg.content.toLowerCase() == 's.a' || msg.content.toLowerCase() == 'selamun aleyküm') {
          try {
                  return msg.reply('Aleyküm Selam, Hoşgeldin')
          } catch(err) {
            console.log(err);
          }
      }
    }
    else if (i == 'kapali') {
    }
    if (!i) return;
  
    });





client.on("guildMemberAdd", async (member) => {
      let autorole =  JSON.parse(fs.readFileSync("./otorol.json", "utf8"));
      let role = autorole[member.guild.id].sayi

      member.addRole(role)
});


 client.on("guildMemberAdd", async member => {
  
  let gck = await db.fetch(`giriscikisKanal_${member.guild.id}`);
  if (!gck) return;
  const gck31 = member.guild.channels.find('name', gck)
  let username = member.user.username;
  const bg = await Jimp.read("https://cdn.discordapp.com/attachments/521318163653197825/521384242727485440/Yeil_Join.png");
  const userimg = await Jimp.read(member.user.avatarURL);
  var font;
  if (member.user.tag.length < 15) font = await Jimp.loadFont(Jimp.FONT_SANS_128_WHITE);
  else if (member.user.tag.length > 15) font = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE);
  else font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
  await bg.print(font, 430, 170, username);
  await userimg.resize(362, 362);
  await bg.composite(userimg, 43, 26).write("./x/hosgeldin.png");
  setTimeout(function () {
    gck31.send(`\`@${member.user.tag}\` adlı kullanıcı sunucuya katıldı.`)
    gck31.send(new Discord.Attachment("./x/hosgeldin.png"));
  }, 1000);
  setTimeout(function () {
    fs.unlink("./x/hosgeldin.png");
  }, 10000);
})

 client.on("guildMemberRemove", async member => {
 
  let gck = await db.fetch(`giriscikisKanal_${member.guild.id}`);
  const gck31 = member.guild.channels.find('name', gck)
  if (!gck) return;
  if (!gck31) return;
  let username = member.user.username;          
  const bg = await Jimp.read("https://cdn.discordapp.com/attachments/521318163653197825/521384181943500820/Krmz2_.png");
  const userimg = await Jimp.read(member.user.avatarURL);
  var font;
  if (member.user.tag.length < 15) font = await Jimp.loadFont(Jimp.FONT_SANS_128_WHITE);
  else if (member.user.tag.length > 15) font = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE);
  else font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
  await bg.print(font, 430, 170, username);
  await userimg.resize(362, 362);
  await bg.composite(userimg, 43, 26).write("./x/gorusuruz.png");
  setTimeout(function () {
    gck31.send(`\`@${member.user.tag}\` adlı kullanıcı sunucudan ayrıldı.`)
    gck31.send(new Discord.Attachment("./x/gorusuruz.png"));
  }, 1000);
  setTimeout(function () {
    fs.unlink("./x/gorusuruz.png");
  }, 10000);
}) 

client.on("guildMemberAdd", async member => {
  
  let sayac = await db.fetch(`sayac_${member.guild.id}`);
  let skanal9 = await db.fetch(`sayacK_${member.guild.id}`);
  if (!skanal9) return;
  const skanal31 = member.guild.channels.find('name', skanal9)
  if (!skanal31) return
  skanal31.send(`📥 \`${member.user.tag}\` adlı kullanıcı sunucuya katıldı. \`${sayac}\` kullanıcı olmaya \`${sayac - member.guild.members.size}\` kullanıcı kaldı.`)
});

client.on("guildMemberRemove", async member => {
  
  let sayac = await db.fetch(`sayac_${member.guild.id}`);
  let skanal9 = await db.fetch(`sayacK_${member.guild.id}`);
  if (!skanal9) return;
  const skanal31 = member.guild.channels.find('name', skanal9)
  if (!skanal31) return
  skanal31.send(`📤 \`${member.user.tag}\` adlı kullanıcı sunucudan ayrıldı. \`${sayac}\` kullanıcı olmaya \`${sayac - member.guild.members.size}\` kullanıcı kaldı.`)
});


client.on("message", msg => {
  db.fetch(`reklam_${msg.guild.id}`).then(i => {
    if (i == 'acik') {
        const reklam = [".com", ".net", ".xyz", ".tk", ".pw", ".io", ".me", ".gg", "www.", "https", "http", ".gl", ".org", ".com.tr", ".biz", "net", ".rf.gd", ".az", ".party", "discord.gg",];
        if (reklam.some(word => msg.content.includes(word))) {
          try {
            if (!msg.member.hasPermission("BAN_MEMBERS")) {
                  msg.delete();
                      return msg.reply('Bu Sunucuda Reklam Engelleme Filtresi Aktiftir. Reklam Yapmana İzin Veremem !').then(msg => msg.delete(3000));
    

  msg.delete(3000);                              

            }              
          } catch(err) {
            console.log(err);
          }
        }
    }
    else if (i == 'kapali') {
      
    }
    if (!i) return;
  })
    });

client.on("message", async message => {
  var user = message.mentions.users.first() || message.author;
    if (message.content.toLowerCase() === prefix + "kralol") {
        var user = message.mentions.users.first() || message.author;
        if (!message.guild) user = message.author;

        message.channel.send("Yapıyorum Bekle Dostum ... :timer: ").then(m => m.delete(4000));
        await message.channel.send(`**${message.author.tag}** artık kral oldun!`)
        Jimp.read(user.avatarURL, (err, image) => {
            image.resize(310, 325)
            Jimp.read("https://cdn.discordapp.com/attachments/518121310946066472/533894968117297153/kral.png", (err, avatar) => {
                avatar.resize(310, 325)
                image.composite(avatar, 2, 0).write(`./img/snip/${client.user.id}-${user.id}.png`);
                setTimeout(function() {
                    message.channel.send(new Discord.Attachment(`./img/snip/${client.user.id}-${user.id}.png`));
                }, 1000);
            });

        });
    }
 });


client.on('guildCreate', guild => {
let rrrsembed = new Discord.RichEmbed()
.setColor("#54ecf9")
.setTitle(":inbox_tray: | Botumuzu Ekledi ")
.addField("Sunucu Adı:", guild.name)
.addField("Sunucu sahibi", guild.owner)
.addField("Sunucu Sahibi'nin ID'si", guild.ownerID)
.addField("Sunucudaki Kişi Sayısı:", guild.memberCount)
.addField("Sunucudaki Kişi Sayısı:", guild.invite)
 client.channels.get('533892060780953600').send(rrrsembed);
}); 
       

       
client.on('guildDelete', guild => {
let rrsembed = new Discord.RichEmbed()
.setColor("#54ecf9")
.setTitle(":outbox_tray: | Botumuzu Çıkardı :(")
.addField("Sunucu Adı:", guild.name)
.addField("Sunucu sahibi", guild.owner)
.addField("Sunucu Sahibi'nin ID'si", guild.ownerID)
.addField("Sunucudaki Kişi Sayısı:", guild.memberCount)
 client.channels.get('533892060780953600').send(rrsembed);
}); 


client.on('message', async msg => {
    if (msg.content.toLowerCase() === prefix + "disko") {
   if (msg.channel.type === "dm") return;
  var srol = await db.fetch(`discorole_${msg.guild.id}`)
  var role = msg.guild.roles.find(e => e.name === `${srol}`);
  msg.channel.send(`<a:onay:531012793080610816> | **Artık ${srol} sürekli renk değiştirecek!**`)
  setInterval(() => {
      msg.guild.roles.find(s => s.name === srol).setColor("RANDOM")
      }, 5000);
     return;
  }
});



client.on("messageDelete", message => {
  
  if (message.author.bot) return;
  
  var user = message.author;
  
  var kanal = message.guild.channels.get(db.fetch(`${message.guild.id}.log`));
  if (!kanal) return;
  
  const embed = new Discord.RichEmbed()
  .setColor("RANDOM")
  .setAuthor(`Bir Mesaj Silindi!`, message.author.avatarURL)
  .addField("Kullanıcı Tag", message.author.tag, true)
  .addField("ID", message.author.id, true)
  .addField("Silinen Mesaj", "```" + message.content + "```")
  .setThumbnail(message.author.avatarURL)
  kanal.send(embed);
  
});

client.on("messageUpdate", async (oldMsg, newMsg) => {
  
  if (oldMsg.author.bot) return;
  
  var user = oldMsg.author;
  
  var kanal = oldMsg.guild.channels.get(db.fetch(`${oldMsg.guild.id}.log`));
  if (!kanal) return;
  
  const embed = new Discord.RichEmbed()
  .setColor("RANDOM")
  .setAuthor(`Bir Mesaj Düzenlendi!`, oldMsg.author.avatarURL)
  .addField("Kullanıcı Tag", oldMsg.author.tag, true)
  .addField("ID", oldMsg.author.id, true)
  .addField("Eski Mesaj", "```" + oldMsg.content + "```")
  .addField("Yeni Mesaj", "```" + newMsg.content + "```")
  .setThumbnail(oldMsg.author.avatarURL)
  kanal.send(embed);
  
});

client.on("roleCreate", role => {
  
  var kanal = role.guild.channels.get(db.fetch(`${role.guild.id}.log`));
  if (!kanal) return;
  
  const embed = new Discord.RichEmbed()
  .setColor("RANDOM")
  .setAuthor(`Bir Rol Oluşturuldu!`, role.guild.iconURL)
  .addField("Rol", `\`${role.name}\``, true)
  .addField("Rol Rengi Kodu", `${role.hexColor}`, true)
  kanal.send(embed);
  
});

client.on("roleDelete", role => {
  
  var kanal = role.guild.channels.get(db.fetch(`${role.guild.id}.log`));
  if (!kanal) return;
  
  const embed = new Discord.RichEmbed()
  .setColor("RANDOM")
  .setAuthor(`Bir Rol Kaldırıldı!`, role.guild.iconURL)
  .addField("Rol", `\`${role.name}\``, true)
  .addField("Rol Rengi Kodu", `${role.hexColor}`, true)
  kanal.send(embed);
  
});

client.on("roleUpdate", role => {
  
  if (!log[role.guild.id]) return;
  
 var kanal = role.guild.channels.get(db.fetch(`${role.guild.id}.log`));
  if (!kanal) return;
  
  const embed = new Discord.RichEmbed()
  .setColor("RANDOM")
  .setAuthor(`Bir Rol Güncellendi!`, role.guild.iconURL)
  .addField("Rol", `\`${role.name}\``, true)
  .addField("Rol Rengi Kodu", `${role.hexColor}`, true)
  kanal.send(embed);
  
});

client.on('voiceStateUpdate', (oldMember, newMember) => {
  
  
  
  var kanal = oldMember.guild.channels.get(db.fetch(`${oldMember.guild.id}.log`));
  if (!kanal) return;
  
  let newUserChannel = newMember.voiceChannel
  let oldUserChannel = oldMember.voiceChannel

  if(oldUserChannel === undefined && newUserChannel !== undefined) {

    const embed = new Discord.RichEmbed()
    .setColor("RANDOM")
    .setDescription(`${newMember.user.tag} adlı kullanıcı \`${newUserChannel.name}\` isimli sesli kanala giriş yaptı!`)
    kanal.send(embed);
    
  } else if(newUserChannel === undefined){

    const embed = new Discord.RichEmbed()
    .setColor("RANDOM")
    .setDescription(`${newMember.user.tag} adlı kullanıcı bir sesli kanaldan çıkış yaptı!`)
    kanal.send(embed);
    
  }
});
