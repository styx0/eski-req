const Discord = require("discord.js");
const db = require('quick.db');
exports.run = async (client, message, args) => {
  const kayıtlı = message.guild.roles.find(r => r.id === "740887660075417730"); //buraya erkek rolünüzün id'sini koyun
  const kayıtlı2 = message.guild.roles.find(r => r.id === "740887660863684619"); //buraya erkek rolünüzün id'sini koyun
  const misafir = message.guild.roles.find(r => r.id === "740887671030939699"); //buraya misafir rolünüzün id'sini koyun.
  const tag = "❖";//YAZMAK İSTERSENİZ TAGINIZ ( BOŞ BIRAKABİLİRSİNİZ )
  if(!message.member.roles.array().filter(r => r.id === "740887606296051744")[0]) { //buraya kayıt sorumlusu rolünün id'sini giriniz. SUNUCU AYARLARINDAN kopyalayın.
    return message.channel.send(`**Bu işlemi sadece  \`${message.guild.roles.get('740887606296051744').name}\` yetkisindeki kişiler kullanabilir  ** <a:jesalon_carpi:741060300140183552>    `);
  } else {
    let member = message.mentions.users.first() || client.users.get(args.join(' '))
      if(!member) return message.channel.send("Bir kullanıcı girin. <a:jesalon_carpi:741060300140183552>  ")
    const c = message.guild.member(member)
    const nick = args[1];
    const yas = args[2];
      if(!nick) return message.channel.send("Bir isim girin. <a:jesalon_carpi:741060300140183552>  ")
      if(!yas) return message.channel.send("Bir yaş girin. <a:jesalon_carpi:741060300140183552>  ")
    await c.addRole(kayıtlı)
   await c.addRole(kayıtlı2)
   await c.removeRole(misafir)
   await c.setNickname(`${tag} ${nick} | ${yas}`)
    const embed = new Discord.RichEmbed()
       .setFooter(client.user.username, client.user.avatarURL)
    .setThumbnail(message.author.avatarURL)
    .setDescription(`${c} Kullanıcısı ${message.author} Tarafından Kayıt Edildi.

Kayıt Edilen : ${c}
Yeni İsim : ${tag} ${nick} | ${yas}
Kayıtta Verilen Roller : ${kayıtlı},${kayıtlı2}
Kayıtta Alınan Roller : ${misafir}`)
    .setColor('RANDOM')
    message.channel.send(embed)
  }
}
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["k", "kadın", "woman"], // Gibieklersen e, erkek , man v.s yazdığında komut çalışır. eyw
  permLevel: 0
};
exports.help = {
  name: "k",
  description: "",
  usage: "k"
};
  

// Bu Ksımmlar Allies 'e Ekleyebilrsn Mesela'