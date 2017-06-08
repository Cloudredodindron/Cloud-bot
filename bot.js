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
  if (msg.content.includes('!translate')) {
    var messageContent = msg.content.split('!translate')[1].split('!opt')
    var toTranslate = messageContent[0]
    var langue = 'en'
    translate.translate(toTranslate, langue, function (err, result) {
      if (err) {
        return
      }
      msg.channel.sendMessage(result)
    })
  }
})

client.login(config.token)
