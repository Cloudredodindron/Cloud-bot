const Discord = require('discord.js')
var Twitter = require('twitter')
const config = require('./config.js')
const client = new Discord.Client()
var twitter = new Twitter(config.twitter)

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
      twitter.post('statuses/update', tweet)
      msg.channel.send('Tweet lancé ! : ' + msgtweet)
    } else {
      msg.channel.send('Tweet trop long')
    }
  }
  twitter.stream('statuses/filter', {track: '#chloe'}, function (stream) {
    stream.on('data', function (tweet) {
      console.log(tweet.text)
      msg.channel.sendMessage(" On t'a taggué dans ce tweet : ")
    })

    stream.on('error', function (error) {
      console.log(error)
    })
  })
})

client.login(config.token)
