const Discord = require('discord.js');
const client = new Discord.Client();
const ayarlar = require('./ayarlar.json');
const chalk = require('chalk');
const moment = require('moment');
var Jimp = require('jimp');
const { Client, Util } = require('discord.js');
const weather = require('weather-js')
const fs = require('fs');
const db = require('quick.db');
require('./util/eventLoader')(client);
const request = require('request');
const snekfetch = require('snekfetch');
const queue = new Map();
const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');



var prefix = ayarlar.prefix;

const log = message => {
    console.log(`${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./komutlar/', (err, files) => {
    if (err) console.error(err);
    log(`${files.length} komut yüklenecek.`);
    files.forEach(f => {
        let props = require(`./komutlar/${f}`);
        log(`Yüklenen komut: ${props.help.name}.`);
        client.commands.set(props.help.name, props);
        props.conf.aliases.forEach(alias => {
            client.aliases.set(alias, props.help.name);
        });
    });
});



client.reload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./komutlar/${command}`)];
            let cmd = require(`./komutlar/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

client.load = command => {
    return new Promise((resolve, reject) => {
        try {
            let cmd = require(`./komutlar/${command}`);
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};



client.on('message', async message => {
  if (message.content === '.katıl') { // . yerine prefixi yaz
    client.emit('guildMemberAdd', message.member || await message.guild.fetchMember(message.author));
      }
  });

  client.on('message', async message => {
    if (message.content === '.ayrıl') { // . yerine prefixi yaz
      client.emit('guildMemberRemove', message.member || await message.guild.fetchMember(message.author));
        }
    });







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
        } catch (e) {
            reject(e);
        }
    });
};

client.elevation = message => {
    if (!message.guild) {
        return;
    }
    let permlvl = 0;
    if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
    if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
    if (message.author.id === ayarlar.sahip) permlvl = 4;
    return permlvl;
};

client.on("guildMemberAdd", member => {
  const kanal = "740887793903075390"; //
  moment.locale("tr");// Saat icin gerekli
 let sunucu = client.guilds.get("452840722601738241")
  let samet = sunucu.channels.get(kanal);
  samet.send(
    "   <a:Jesalon_kelebek:740904314960347258> " +
      member +
      "** Hoş Geldin!  **\n\n **<a:Jesalon_kelebek:740904314960347258>   Seninle Birlikte " +
      member.guild.memberCount +
      " Kişiyiz  ** \n\n **<a:Jesalon_kelebek:740904314960347258>   Kayıt olmak için,  <@&740887606296051744>  yetkililerini etiketleyip ses teyit odalarına geçebilirsin. **  \n\n **<a:Jesalon_kelebek:740904314960347258>   Hesabın Oluşturulma Tarihi :** " +
      moment(member.user.createdAt).format(" `DD MMMM YYYY, dddd  hh:mm:ss` " , " ") +
      " \n\n **<a:emoji_5:740901055466045510>   Tagımızı Alarak Bize Destek Olabilirsin <a:emoji_5:740901055466045510>   **",
    new Discord.Attachment(
      "https://i.pinimg.com/originals/14/7e/8e/147e8e41cc42269e155c09a5e336e0eb.gif"
    )
  );
});


client.on('ready', ()=>{
  let kanal = client.channels.get("740887828657078313")
  if(!kanal) return;
kanal.join()
})
// Bu Kısmı Düzelttim Eğer Kanal Silinirse bot Hata Vermez



var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
// client.on('debug', e => {
//   console.log(chalk.bgBlue.green(e.replace(regToken, 'that was redacted')));
// });

client.on('warn', e => {
    console.log(chalk.bgYellow(e.replace(regToken, 'that was redacted')));
});

client.on('error', e => {
    console.log(chalk.bgRed(e.replace(regToken, 'that was redacted')));
});

//////
client.on("message", async message => {
    let uyarisayisi = await db.fetch(`reklamuyari_${message.author.id}`);
    let reklamkick = await db.fetch(`reklamkick_${message.guild.id}`)
    let kullanici = message.member;
    if (reklamkick == 'kapali') return;
    if (reklamkick == 'acik') {
        const reklam = ["discord.app", "discord.gg", "discordapp", "discordgg", ".com", ".net", ".xyz", ".tk", ".pw", ".io", ".me", ".gg", "www.", "https", "http", ".gl", ".org", ".com.tr", ".biz", ".party", ".rf.gd", ".az",];
        if (reklam.some(word => message.content.toLowerCase().includes(word))) {
            if (!message.member.hasPermission("ADMINISTRATOR")) {
                message.delete();
                db.add(`reklamuyari_${message.author.id}`, 1) //uyarı puanı ekleme
                if (uyarisayisi === null) {
                    let uyari = new Discord.RichEmbed()
                        .setColor("RANDOM")
                        .setFooter('Reklam kick sistemi', client.user.avatarURL)
                        .setDescription(`<@${message.author.id}> reklam kick sistemine yakalandın! Reklam yapmaya devam edersen kickleniceksin (1/3)`)
                        .setTimestamp()
                    message.channel.send(uyari)                
}
                if (uyarisayisi === 1) {
                    let uyari = new Discord.RichEmbed()
                        .setColor("RANDOM")
                        .setFooter('Reklam kick sistemi', client.user.avatarURL)
                        .setDescription(`<@${message.author.id}> reklam kick sistemine yakalandın! Reklam yapmaya devam edersen kickleniceksin (2/3)`)
                        .setTimestamp()
                    message.channel.send(uyari)
                }
                if (uyarisayisi === 2) {
                    message.delete();
                    await kullanici.kick({
                        reason: `Reklam kick sistemi`,
                    })
                    let uyari = new Discord.RichEmbed()
                        .setColor("RANDOM")
                        .setFooter('Reklam kick sistemi', client.user.avatarURL)
                        .setDescription(`<@${message.author.id}> 3 adet reklam uyarısı aldığı için kicklendi. Bir kez daha yaparsa banlanacakç`)
                        .setTimestamp()
                    message.channel.send(uyari)
                }
                if (uyarisayisi === 3) {
                    message.delete();
                    await kullanici.ban({
                        reason: `Reklam ban sistemi`,
                    })
                    db.delete(`reklamuyari_${message.author.id}`)
                    let uyari = new Discord.RichEmbed()
                        .setColor("RANDOM")
                        .setFooter('Reklam kick sistemi', client.user.avatarURL)
                        .setDescription(`<@${message.author.id}> kick yedikten sonra tekrar devam ettiği için banlandı.`)
                        .setTimestamp()
                    message.channel.send(uyari)
                }

            }
        }
    }
});

//fakekullanıcı
client.on('guildMemberAdd',async member => {
  let kisi = client.users.get(member.id);
    const zaman = new Date().getTime() - kisi.createdAt.getTime();
    if (zaman < 2592000001) 
  member.addRole("740887628164890635")
  member.removeRole("740887671030939699")
});




client.login(ayarlar.token);