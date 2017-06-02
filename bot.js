  const Discord = require('discord.js')
  const config = require('./config.js')
  const client = new Discord.Client()
  var restClient = require('node-rest-client-promise').Client()
  var city = ''
  var temperature
  var idMeteo
  var hour
  var heureDetectee
  var Jour
  var Mois
  var Iso
  var Time

  client.on('ready', () => {
    console.log(`Logged in as ${client.user.username}!`)
  })

  client.on('message', msg => {
  // Check if the message has been posted in a channel where the bot operates
  // and that the author is not the bot itself
    function meteo (idWeather) {
      if (idMeteo >= 200 && idMeteo < 300) {
        msg.channel.sendMessage('Courage ! Fuyons ! C\'est emballé :thunder_cloud_rain: ')
      } else if (idMeteo >= 300 && idMeteo < 500) {
        msg.channel.sendMessage('On peut en profiter pour prendre notre douche du mois :cloud_rain:')
      } else if (idMeteo >= 500 && idMeteo <= 501) {
        msg.channel.sendMessage('Bon, certes, il pleut, mais de l\'eau ! C\'est mieux que la pluie de météores de l\'autre fois :cloud_rain:')
      } else if (idMeteo >= 502 && idMeteo < 600) {
        msg.channel.sendMessage('Woop Woop Woop Woop :cloud_rain:')
      } else if (idMeteo >= 600 && idMeteo < 700) {
        msg.channel.sendMessage('Il neige, je crois que c\'est le plus beau jour de ma vie, je cherchais quelque chose de beau et pas cher pour une femme qui est un peu comme ça :cloud_snow:')
      } else if (idMeteo === 800) {
        msg.channel.sendMessage('Cette météo me rend tout chose, j\'en ai d\'ailleurs profité pour fertiliser votre caviar :sunny:')
      } else if (idMeteo > 800 && idMeteo < 900) {
        msg.channel.sendMessage('Les petits pois, pour que ça pousse, faut les arroser ! :cloud:')
      }
    }
    if (msg.channel.type !== 'dm' && (config.channel !== msg.channel.id || msg.author.id === client.user.id)) return

    if (msg.content === 'hello') {
      msg.channel.sendMessage('Yeepeeee ! Enfin quelqu\'un qui s\'intéresse à moi ! ' + 'Je connais les commandes weather + ville || forecast + numéro + ville || help, qui t\'aidera à utiliser forecast')
    } else if (msg.content.match('!weather*') !== null) {
      city = msg.content.substring(6, msg.content.length)
      msg.channel.sendMessage(city + ' ')
      restClient.getPromise('http://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=metric&lang=fr&APPID=f2a0bbeb2be940aadb681a04cb266859')
      .catch((error) => {
        throw error
      })
      .then((res) => {
        msg.channel.sendMessage('Menu Weather')
        temperature = res.data.main.temp
        if (temperature <= 15) {
          msg.channel.sendMessage('Pense à ton petit pull ! la temperature est de ' + temperature + ' degrés !')
        } else {
          msg.channel.sendMessage('Tu peux enlever ta coquille, la température est de ' + temperature + ' degrés !')
        }
        msg.channel.sendMessage('La pression est de ' + res.data.main.pressure + ' hpa. Cette pression, elle n\'est pas potable !')
        msg.channel.sendMessage('L\'humidité est de ' + res.data.main.humidity + '%. C\'est l\'idéal pour sortir les marmots et aller à la plage!')
        msg.channel.sendMessage('Le vent va à ' + res.data.wind.speed + ' km/h. On approche du mur du son!')
        msg.channel.sendMessage('En bref... ' + res.data.weather[0].description)
        idMeteo = res.data.weather[0].id
        meteo(idMeteo)
        console.log(res.response.statusCode)
      })
    } else if (msg.content.match('!help*') !== null) {
      msg.channel.sendMessage('Ne sois pas triste, tu as toujours ton docteur Zoidberg.')
      restClient.getPromise('http://api.openweathermap.org/data/2.5/forecast?q=Paris&units=metric&lang=fr&APPID=f2a0bbeb2be940aadb681a04cb266859')
          .catch((error) => {
            throw error
          })
          .then((res) => {
            console.log(res)
            for (var k = 0; k <= 7; k++) {
              heureDetectee = parseFloat(res.data.list[k].dt_txt.substring(11, 13))
              msg.channel.sendMessage('Pour ' + heureDetectee + 'h, tapez ' + k + ' entre Forecast et le nom de la ville')
            }
          })
    } else if (msg.content.match('!forecast*') !== null) {
      hour = msg.content.substring(10, 11)
      if (hour.match(/[0-7]/) === null) {
        msg.channel.sendMessage('Il faut mettre une heure entre 0 et 7 rappelle-toi, tu ne l\'as pas mise ! Docteur Zoidberg à ton service !help')
      }
      city = msg.content.substring(12, msg.content.length)
      msg.channel.sendMessage('Alors alors... pour la ville de ' + city + 'laisse-moi te dire la météo...')
      hour = parseFloat(hour)
      restClient.getPromise('http://api.openweathermap.org/data/2.5/forecast?q=' + city + '&units=metric&lang=fr&APPID=http://api.openweathermap.org/data/2.5/forecast?q=Paris&units=metric&lang=fr&APPID=f2a0bbeb2be940aadb681a04cb266859')
      .catch((error) => {
        throw error
      })
      .then((res) => {
        console.log(res)
        // msg.channel.sendMessage(Date.now())
        // msg.channel.sendMessage(res.data.list[0].dt)
        // msg.channel.sendMessage(res.data.list[0].dt_txt)
        // msg.channel.sendMessage(res.data.list[0].dt_txt.substring(11, 13))

        // msg.channel.sendMessage(hour + ' ' + res.data.list.length)
        for (var heure = hour; heure <= res.data.list.length; heure = heure + 8) {
          Iso = new Date(res.data.list[heure].dt_txt)
          Jour = Iso.getDate()
          Mois = Iso.getMonth()
          Time = Iso.getHours()
          msg.channel.sendMessage('Le ' + Jour + '/' + Mois + ' à ' + Time + 'h' + ' il fait ' + res.data.list[heure].main.temp + ' degrés ! ')
          idMeteo = res.data.list[heure].weather[0].id
          meteo(idMeteo)
        }
      })
    } else if (msg.content === 'how are you?') {
      msg.channel.sendMessage('It\'s all so complicated with the flowers and the romance, and the lies upon lies!')
    } else if (msg.content === 'where are you?') {
      msg.channel.sendMessage('You’ll never guess where I’ve been!')
    }
  })
  client.login(config.token)
