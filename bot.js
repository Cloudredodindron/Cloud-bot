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

    if (msg.channel.type !== 'dm' && (config.channel !== msg.channel.id || msg.author.id === client.user.id)) return

    if (msg.content === 'hello') {
      msg.channel.sendMessage('I know the weather')

    } else if (msg.content.match('!weather') !== null) {
      city = msg.content.substring(8, msg.content.length)
      restClient.getPromise('http://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=metric&lang=fr&APPID=f2a0bbeb2be940aadb681a04cb266859')
      .catch((error) => {
        throw error
      })
      .then((res) => {
        msg.channel.sendMessage('Météo à '+ city + ' :')
        temperature = res.data.main.temp
        pressure = res.data.main.pressure
        humidity = res.data.main.humidity
        speed = res.data.wind.speed
        description = res.data.weather[0].description
        msg.channel.sendMessage('La temperature est de ' + temperature + ' degrés.')
        msg.channel.sendMessage('La pression est de ' + pressure + ' hpa.')
        msg.channel.sendMessage('L\'humidité est de ' + humidity + '%.')
        msg.channel.sendMessage('Le vent va à ' + speed + ' km/h.')
        msg.channel.sendMessage('Description : '+ description)
        console.log(res.response.statusCode)
      })


    } else if (msg.content.match('!forecast') !== null) {
      
      city = msg.content.substring(9, msg.content.length)
      restClient.getPromise('http://api.openweathermap.org/data/2.5/forecast?q=' + city + '&units=metric&lang=fr&APPID=f2a0bbeb2be940aadb681a04cb266859')
      .catch((error) => {
        throw error
      })

      .then((res) => {
        msg.channel.sendMessage('Prévision sur 5 jours à '+ city)
        num_list=0
        for (num_list; num_list <= 35; num_list = num_list + 1 ) { 
          temp_list = res.data.list[num_list].main.temp
          msg.channel.sendMessage('La temperature est de ' + temp_list + ' degrés.')
        }
        

      
      })
    }
  })
  client.login(config.token)




    
 /* } else if (msg.content.match('!forecast') !== null) {
      hour = msg.content.substring(10, 11)
      if (hour.match(/[0-7]/) === null) {
        msg.channel.sendMessage('Mettez un créneau horaire entre 0 et 7, 0 : instant réel, 1 : +3h, 2:+6h et ainsi de suite')
      }
      msg.channel.sendMessage(' créneau horaire choisi : ' + hour )
      city = msg.content.substring(8, msg.content.length)
      msg.channel.sendMessage('Ville de ' + city )
      hour = parseFloat(hour)
      restClient.getPromise('http://api.openweathermap.org/data/2.5/forecast?q=' + city + '&units=metric&lang=fr&APPID=f2a0bbeb2be940aadb681a04cb266859')
      .catch((error) => {
        throw error
      })
      .then((res) => {
        console.log(res)
        // msg.channel.sendMessage(Date.now())
        // msg.channel.sendMessage(res.data.list[0].dt)
        // msg.channel.sendMessage(res.data.list[0].dt_txt)
        // msg.channel.sendMessage(res.data.list[0].dt_txt.substring(11, 13))

        //msg.channel.sendMessage(hour + ' ' + res.data.list.length)//
        for (var heure = hour; heure <= res.data.list.length; heure = heure + 8) {
          Iso = new Date(res.data.list[heure].dt_txt)
          Jour = Iso.getDate()
          Mois = Iso.getMonth()
          Time = Iso.getHours()
          msg.channel.sendMessage('Le ' + Jour + '/' + Mois + ' à ' + Time + 'h' + ' il fait ' + res.data.list[heure].main.temp + ' degrés ! ')
          idMeteo = res.data.list[heure].weather[0].id
          
        }
      })
  
    }
  })
  client.login(config.token)*/
