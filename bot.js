const Discord = require('discord.js')
const config = require('./config.js')
const client = new Discord.Client()
var translate = require('@google-cloud/translate')({
  key: 'AIzaSyAsjKDAU2Yy3Qc56OR8Ydcu99DO4rFXDlk'
})

client.on('ready', () => {
  console.log(`Logged in as ${client.user.username}!`)
})

client.on('message', msg => {
  // Check if the message has been posted in a channel where the bot operates
  // and that the author is not the bot itself
  if (msg.channel.type !== 'dm' && (config.channel !== msg.channel.id || msg.author.id === client.user.id)) return

  // If message is hello, post hello too
  if (msg.content === 'hello') {
    msg.channel.sendMessage('Hello to you too, fellow !')
  }
  if (msg.content.match(/!translate.*/)) {
    var msgtranslate = msg.content
    var langue = msg.content.substring(11, 13)
    translate.translate(msgtranslate.substring(13), 'en', function (err, translation) {
      if (!err) {
        msg.channel.sendMessage(translation)
      } else {
        console.log(err)
      }
    })
  }
})

client.login(config.token)
