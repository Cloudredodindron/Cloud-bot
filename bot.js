
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
  client.on('ready', () => {
    console.log(`Logged in as ${client.user.username}!`)
  })
  client.on('message', msg => {
    if (msg.channel.type !== 'dm' && (config.channel !== msg.channel.id || msg.author.id === client.user.id)) return
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
    } if (msg.content.match('!youtube') !== null) {
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
    } if (msg.content === 'hello') {
      msg.channel.sendMessage('I know the weather')
    } else if (msg.content.match('!weather') !== null) {
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
    } else if (msg.content.match('!forecast') !== null) {
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
    }
  })
  client.login(config.token)