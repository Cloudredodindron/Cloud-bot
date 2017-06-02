const Discord = require('discord.js')
var Twitter = require('twitter')
const config = require('./config.js')
const client = new Discord.Client()


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
  var msgtweet = msg.content
  msgtweet = msgtweet.substring(7)
  if (msg.content === '!tweet ' + msgtweet) {
    if (msgtweet.length < 141) {
      var tweet = {
        status: msgtweet
      }
      var twitter = new Twitter(config.twitter)
      twitter.post('statuses/update', tweet)
      msg.channel.send('Tweet lancé !')
    } else {
      msg.channel.send('Tweet trop long')
    }
  }
  if (msg.content === '#EmmanuelMacron') {
    var twitterstream = new Twitter(config.twitter)
    twitterstream.stream('statuses/filter', {track: '#Cloud-bot-redo'}, function (stream) {
      stream.on('data', function (tweet) {
        msg.channel.send('On te mentionne!')
      })
    })
  }
})

client.login(config.token)
