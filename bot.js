  const httpClient = require('node-rest-client-promise').Client()
  const Discord = require('discord.js')
  const config = require('./config.js')
  const client = new Discord.Client()
  var restClient = require('node-rest-client-promise').Client()
  var city = ''
  var temperature
  var pressure
  var humidity
  var speed
  var description
  var numlist
  var templist
  var day
  var month
  var hour
  var iso
  var message = ''
  var translate = require('@google-cloud/translate')({
    key: 'AIzaSyAsjKDAU2Yy3Qc56OR8Ydcu99DO4rFXDlk'
  })
  var Twitter = require('twitter')
  var twitter = new Twitter(config.twitter)
  client.on('ready', () => {
    console.log(`Logged in as ${client.user.username}!`)
  })
  client.on('message', msg => {
    if (msg.channel.type !== 'dm' && (config.channel !== msg.channel.id || msg.author.id === client.user.id)) return
    // TRANSLATE
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
    // YOUTUBE
    } else if (msg.content.match('!youtube') !== null) {
      message = msg.content.substring(8, msg.content.length)
      msg.channel.sendMessage('Recherche pour' + message + ' :')
      restClient.getPromise('https://www.googleapis.com/youtube/v3/search?q=' + message + '&maxResults=3&part=snippet&key=AIzaSyDXNwjxn5Mocc2_AhT25bl5ixvoE91NAhU')
      .catch((error) => {
        throw error
      })
      .then((res) => {
        console.log(res.data.items)
        for (var i = 0; i < res.data.items.length; i++) {
          var num = res.data.items[i]
          if (num.id.kind === 'youtube#channel') {
            var channelId = num.id.channelId
            var url1 = 'https://www.youtube.com/channel/' + channelId
            msg.channel.sendMessage(url1)
          } else if (num.id.kind === 'youtube#video') {
            var videoId = num.id.videoId
            var url2 = 'https://www.youtube.com/watch?v=' + videoId
            msg.channel.sendMessage(url2)
          }
        }
        console.log(res.response.statusCode)
      })
    // WEATHER
    } else if (msg.content.match('!weather') !== null) { // Fonctionnalité weather
      city = msg.content.substring(8, msg.content.length)
      restClient.getPromise('http://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=metric&lang=fr&APPID=f2a0bbeb2be940aadb681a04cb266859')
      .catch((error) => {
        throw error
      })
      .then((res) => {
        msg.channel.sendMessage('Météo à ' + city + ' :')
        temperature = res.data.main.temp
        pressure = res.data.main.pressure
        humidity = res.data.main.humidity
        speed = res.data.wind.speed
        description = res.data.weather[0].description
        msg.channel.sendMessage('La temperature est de ' + temperature + ' degrés.')
        msg.channel.sendMessage('La pression est de ' + pressure + ' hpa.')
        msg.channel.sendMessage('L\'humidité est de ' + humidity + '%.')
        msg.channel.sendMessage('Le vent va à ' + speed + ' km/h.')
        msg.channel.sendMessage('Description : ' + description)
        console.log(res.response.statusCode)
      })
    } else if (msg.content.match('!forecast') !== null) { // Fonctionnalité forecast
      city = msg.content.substring(9, msg.content.length)
      restClient.getPromise('http://api.openweathermap.org/data/2.5/forecast?q=' + city + '&units=metric&lang=fr&APPID=f2a0bbeb2be940aadb681a04cb266859')
      .catch((error) => {
        throw error
      })
      .then((res) => {
        msg.channel.sendMessage('Prévision sur 5 jours à ' + city + ' :')
        numlist = 0
        for (numlist; numlist <= 40; numlist = numlist + 8) {
          templist = res.data.list[numlist].main.temp
          iso = new Date(res.data.list[numlist].dt_txt)
          day = iso.getDate()
          month = iso.getMonth() + 1
          hour = iso.getHours()
          msg.channel.sendMessage('La temperature est de ' + templist + ' degrés ' + 'le ' + day + '/' + month + ' à ' + hour + 'h')
        }
      })
    // POKEMON
    } else if (msg.content.match(/!pokemon.*/)) { // Fonctionnalité transformation du bot en un pokemon donné
      var pokesearch = msg.content.substring(9)
      var urlpokemon = 'http://pokeapi.co/api/v2/pokemon/' + pokesearch
      httpClient.getPromise(urlpokemon, function (result, error) {
        if (result) {
          var newnamebot = JSON.stringify(result.forms[0].name, null, 2).substring(1, JSON.stringify(result.forms[0].name, null, 2).length - 1)
          var picture = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + JSON.stringify(result.id, null, 2) + '.png'
          client.user.setAvatar(picture)
          client.user.setUsername(newnamebot)
        .then(user => console.log(`My new username is ${user.username}`))
        .catch(console.error)
          msg.channel.sendMessage('Bonjour, je me nomme ' + JSON.stringify(result.forms[0].name, null, 2) + '! Je suis un pokemon de type ' + JSON.stringify(result.types[0].type.name, null, 2) + '. Mon id est : ' + JSON.stringify(result.id, null, 2) + '. Je pèse ' + JSON.stringify(result.weight, null, 2) + ' pounds' + ' et je mesure ' + JSON.stringify(result.height, null, 2) + ' pieds.')
        } else {
          console.log(error)
        }
      })
    // SPOTIFY
    } else if (msg.content.startsWith('!spotify ')) {
      var SpotifyWebApi = require('spotify-web-api-node')
    // Create the api object with the credentials
      var spotifyApi = new SpotifyWebApi({
        clientId: '7d618a54d6e44ae1934e77160031d192',
        clientSecret: '577a78ca518c447c879bddda7b47d883'
      })
      var msgRecherche = msg.content.split(' ').slice(1)
      console.log(msgRecherche)
    // Retrieve an access token.
      spotifyApi.clientCredentialsGrant()
    .then(function (data) {
      // Save the access token so that it's used in future calls
      spotifyApi.setAccessToken(data.body['BQC-VqUiiy4FRWQqNWr8ElMkNeioY9Jq1AamYDn7NyO208Taf7ojTtbGVB-6dMd3Y-SHM0OSmuIxWshL27mO90xL4XrduZjeN76kej5QyiY_1bEK8aJt68COFVlWiU7DZXYDDnE1yRxEbmA'])
      if (msgRecherche[0] !== '!artist' && msgRecherche[0] !== '!album' && msgRecherche[0] !== '!track') {
        spotifyApi.search(msgRecherche.join(' '), ['artist', 'track', 'album'], {limit: 1}, function (err, data) {
          if (err) {
            console.log('Error occurred: ' + err)
          } else {
            console.log(data)
            msg.channel.send('The track : ' + data.body.tracks.items[0].name)
            msg.channel.send(data.body.tracks.items[0].external_urls.spotify)

            msg.channel.send('The artist : ' + data.body.artists.items[0].name)
            msg.channel.send(data.body.artists.items[0].external_urls.spotify)

            msg.channel.send('The album : ' + data.body.albums.items[0].name)
            msg.channel.send(data.body.albums.items[0].external_urls.spotify)
          }
        }, function (err) {
          console.log('Something went wrong when retrieving an access token', err)
        })
      }
      if (msgRecherche[0] === '!track') {
        spotifyApi.search(msgRecherche.join(' ').substring(6), ['track'], {limit: 1}, function (err, data) {
          if (err) {
            console.log('Error occurred: ' + err)
          } else {
            console.log(data)
            msg.channel.send('The track : ' + data.body.tracks.items[0].name)
            msg.channel.send(data.body.tracks.items[0].external_urls.spotify)
          }
        }, function (err) {
          console.log('Something went wrong when retrieving an access token', err)
        })
      }
      if (msgRecherche[0] === '!artist') {
        spotifyApi.search(msgRecherche.join(' ').substring(7), ['artist'], {limit: 1}, function (err, data) {
          if (err) {
            console.log('Error occurred: ' + err)
          } else {
            console.log(data)
            msg.channel.send('The artist : ' + data.body.artists.items[0].name)
            msg.channel.send(data.body.artists.items[0].external_urls.spotify)
          }
        }, function (err) {
          console.log('Something went wrong when retrieving an access token', err)
        })
      }
      if (msgRecherche[0] === '!album') {
        spotifyApi.search(msgRecherche.join(' ').substring(6), ['album'], {limit: 1}, function (err, data) {
          if (err) {
            console.log('Error occurred: ' + err)
          } else {
            console.log(data)
            msg.channel.send('The album : ' + data.body.albums.items[0].name)
            msg.channel.send(data.body.albums.items[0].external_urls.spotify)
          }
        }, function (err) {
          console.log('Something went wrong when retrieving an access token', err)
        })
      }
    })
    }
    // TWITTER
    var msgtweet = msg.content
    msgtweet = msgtweet.substring(7)
    if (msg.content === '!tweet ' + msgtweet) { // Fonctionnalité envoi d'un tweet
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
    twitter.stream('statuses/filter', {track: '#chloe-bot'}, function (stream) { // Fonctionnalité écoute des tweets, #chloe-bot = compte twitter
      stream.on('data', function (tweet) {
        console.log(tweet.text)
        msg.channel.sendMessage(" On t'a taggué dans ce tweet :  " + tweet.text)
      })
      stream.on('error', function (error) {
        console.log(error)
      })
    })
  })
  client.login(config.token)
