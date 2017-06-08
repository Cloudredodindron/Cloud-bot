const Discord = require('discord.js')
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
  var spotify = require('spotify')
  if (msg.content.startsWith('!spotify')) {
    var args = msg.content.split('').slice(1)
    if (args[0] !== '!artist' && args[0] !== '!tracks' && args[0] !== '!album') {
      spotify.search({ type: 'artist,track,album', query: args.join(' ') }, function (err, data) {
        if (err) {
          msg.channel.send('Il y eu une erreur')
        }
        msg.channel.send('__**Artiste**__ : ' + data.artists.items[0].name)
        msg.channel.send(data.artists.items[0].external_urls.spotify)
        msg.channel.send('__**Album**__ : ' + data.albums.items[0].name)
        msg.channel.send(data.albums.items[0].external_urls.spotify)
        msg.channel.send('__**Titre**__ : ' + data.tracks.items[0].name)
        msg.channel.send(data.tracks.items[0].external_urls.spotify)
      })
      if (args[0] === '!tracks') {
        spotify.search({ type: 'track', query: args.join(' ').substring(6) }, function (err, data) {
          if (err) {
            console.log('Error occurred: ' + err)
          }
          msg.channel.sendMessage('• Track')
          msg.channel.sendMessage(data.tracks.items[0].external_urls.spotify)
        })
      }
      if (args[0] === '!artist') {
        spotify.search({ type: 'artist', query: args.join(' ').substring(7) }, function (err, data) {
          if (err) {
            console.log('Error occurred: ' + err)
          }
          msg.channel.sendMessage('• Artist')
          msg.channel.sendMessage(data.artists.items[0].external_urls.spotify)
        })
      }
      if (args[0] === '!album') {
        spotify.search({ type: 'album', query: args.join(' ').substring(6) }, function (err, data) {
          if (err) {
            console.log('Error occurred: ' + err)
          }
          msg.channel.sendMessage('• Album')
          msg.channel.sendMessage(data.albums.items[0].external_urls.spotify)
        })
      }
    }
  }
})

client.login(config.token)
