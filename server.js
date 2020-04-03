/*
  A ping pong bot, whenever you send "ping", it replies "pong".
*/
const request = require("request");
const fs= require('fs');
const thingiverse = require('thingiverse-js');
var Twit = require('twit')

var T = new Twit({
  consumer_key: 'XXX',
  //Consumer Secret (API Secret)
  consumer_secret: 'XXX',
  //Your Access Token
  access_token: 'XXX',
  //Your  Access Token Secret
  access_token_secret: 'XXX',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
  strictSSL:            true,     // optional - requires SSL certificates to be valid.
})
function covid19belgium() {
    // Setting URL and headers for request
    var options = {
        url: 'https://raw.githubusercontent.com/eschnou/covid19-be/master/covid19-belgium.json',

    };
    // Return new promise 
    return new Promise(function(resolve, reject) {
     // Do async job
        request.get(options, function(err, resp, body) {
            if (err) {
                reject(err);
            } else {
              if(body){
              var obj = JSON.parse(body);
              resolve(obj.data);

              }
            }
        })
    })
}
function github(repos) {
    // Setting URL and headers for request
    var options = {
        url: "https://api.github.com/repos/"+repos+"/commits",
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36'
          }

    };
    // Return new promise 
    return new Promise(function(resolve, reject) {
     // Do async job
        request.get(options, function(err, resp, body) {
            if (err) {
                reject(err);
                console.log(err)
            } else {
              if(body){
              // console.log(body);
              var obj = JSON.parse(body);
              resolve(obj);

              }
            }
        })
    })
}


function Newcas(client,message,token){
  var channel1= client.channels.find(channel => channel.name==='feed-data');

      var initializePromise = covid19belgium(token);
      initializePromise.then(function(result) {

            fs.readFile('newscas.txt',"UTF8", function (err,data) {
                  // if (err) throw err;
                  if(data){
                      var dataparsed=JSON.parse(data);
                      var datalong=dataparsed.length;
                      var resultlong=result.length;
                      console.log(datalong);
                      console.log(resultlong);
                      if(datalong<resultlong && result){
                        var diff=Number(resultlong-datalong);
                        var difftab = result.filter(function( obj ) {
                          return obj.date >dataparsed[datalong-1].date;
                        })
                        var content = JSON.stringify(result);
                        fs.writeFile('newscas.txt', content, function (err) {
                          if (err) throw err;
                              console.log('Saved!',difftab.length);
                        });
                        difftab.forEach((value, key, thisMap) => {
                          var date=value.date;
                          var tests=0+Number(value.daily_tests);
                          var daily_cases=0+Number(value.daily_cases);
                          var cumul_tests=0+Number(value.cumul_tests);
                          var hospitalized=0+Number(value.hospitalized);
                        channel1.send("**[NEWS]** Pour le "+value.date+" Nombre de tests journalier: "+tests+"** | ** Nombres de cas répertoriés:"+daily_cases+"** | ** Ensemble des tests cumulés :"+cumul_tests+"** | ** Nombre hospitalisé:"+hospitalized+" ")
                        })
                        
                      }else{
                        console.log("Pas de nouvelles offres!");
                      }
                    }else{
                      var content = JSON.stringify(result);
                      fs.appendFile('newscas.txt', content, function (err) {
                        if (err) throw err;
                            console.log('Saved!');
                      });
                    }

                    });



                if (result) {
                    // channel.send('RT ' + ' https://twitter.com/' + data.screen_name + '/status/' + data.id_str);
                } else {
                    // channel.send('Sur Twitter ! ' + ' par : ' + data.name + ' @ ' + 'https://twitter.com/' + data.screen_name + '/status/' + data.id_str);
                }
        }, function(err) {
            console.log(err);
        })

}

function gethingerverse(ticker) {
  const token = 'c29def8a6f2e80742780035a8bc2c42e';
    return new Promise(function(resolve, reject) {
      var tag="search?name="+ticker+"&q="+ticker+"&type=things&sort=newest"
     thingiverse(tag, { token }).then(res => {
          resolve(res.body);
        }).catch(err => {
          reject(err);
          console.log(thingiverse.getError(err.response));
        });
    })

}


function getMonitor(client,id,token,repo){
  var channel1= client.channels.find(channel => channel.name==='test');
      console.log("repo",repo);
      var initializePromise = github(repo);
      initializePromise.then(function(result) {
      var directory=id+".txt";

            fs.readFile(directory,"UTF8", function (err,data) {
                  if(data){
                      if(result[0]>data[0] && result){
                        var content = JSON.stringify(result[0]);
                        fs.writeFile(directory, content, function (err) {
                          if (err) throw err;
                              console.log('Saved!');
                        });

                        // difftab.forEach((value, key, thisMap) => {
                          // console.log("value",value);
                        channel1.send("**[NEWS github]** Pour le "+repo+"\n Last commit : https://github.com/"+repo+"/commit/"+result[0].sha+"\n avec le message"+result[0].commit.message);
                        // })
                        
                      }else{
                        console.log("Pas de nouvelles offres!");
                      }
                    }else{
                      // console.log("else",result[0]);

                      var content = JSON.stringify(result);
                      console.log(content);
                      fs.appendFile(directory, content, function (err) {
                        if (err) throw err;
                            console.log('Saved!');
                      });
                    }

                    });



                if (result) {
                    // channel.send('RT ' + ' https://twitter.com/' + data.screen_name + '/status/' + data.id_str);
                } else {
                    // channel.send('Sur Twitter ! ' + ' par : ' + data.name + ' @ ' + 'https://twitter.com/' + data.screen_name + '/status/' + data.id_str);
                }
        }, function(err) {
            console.log(err);
        })


}


//// TESTING
// var initialogin = github("soulteary/crayon-syntax-highlight");
// initialogin.then(function(result) {
//         // console.log("test",result);

//     }, function(err) {
//           console.log(err);
// })
    



   

// Import the discord.js module
const Discord = require('discord.js');

// Create an instance of a Discord client
const client = new Discord.Client();

//558762143588286465
628954010673741828
// The token of your bot - https://discordapp.com/developers/applications/me
const token = 'XXX';

// The ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted
client.on('ready', () => {
  console.log('I am ready!');
});

client.on("guildMemberAdd", (member) => {
  console.log(`New User "${member.user.username}" has joined "${member.guild.name}"` );
  member.guild.channels.find(c => c.name === "bienvenue").send(`Bienvenue <@${member.user.id}> comme nouveaux membre de la #resistancecovid!`);
  
  var faq= client.channels.find(channel => channel.name==="faq");
  var presentation= client.channels.find(channel => channel.name==="presentation");
  var generalfr= client.channels.find(channel => channel.name==="general-fr");
  var generalen= client.channels.find(channel => channel.name==="general-en");
  var respirateur= client.channels.find(channel => channel.name==="respirateur");
  var manifeste= client.channels.find(channel => channel.name==="manifeste");
  var devtools= client.channels.find(channel => channel.name==="dev-tools");
  var demande= client.channels.find(channel => channel.name==="demande-d-acces");


  member.send(`Merci de passer par le Channel <#${presentation.id}>, pour toutes les questions <#${faq.id}> et hesitez pas à venir papoter dans <#${generalfr.id}>  ou <#${generalen.id}>`);
   member.send(`Pour garantir une bonne communication, merci de suivre les étapes suivantes: \nEtape 1: préfixer ton pseudo par la mention pays, ville ou région - ex: [BXL] [FR-90];  \nEtape 2: Demandez un accès à ta cellule sur <#${demande.id}> \nEtape 3: Fais un tour sur ton canal de cellule régional - ex: #bruxelles, #france (ou demander un channel dédié)`);




});

client.on('error', console.error);
let tokenbart;


// setInterval(function(){ 
//   Newcas(client,"",tokenbart);
//   var currentdate = new Date(); 
//   var datetime = "Last Sync: " + currentdate.getDate() + "/"
//                   + (currentdate.getMonth()+1)  + "/" 
//                   + currentdate.getFullYear() + " @ "  
//                   + currentdate.getHours() + ":"  
//                   + currentdate.getMinutes() + ":" 
//                   + currentdate.getSeconds();
//   console.log("Realtime Offre completed: "+datetime);

//  }, 600000);

setInterval(function(){ 
  var repos=["soulteary/crayon-syntax-highlight","resistancecovid-com/resistancecovid.be"];

  repos.forEach((value, key, thisMap) => {
    getMonitor(client,key,tokenbart,value);
    var currentdate = new Date(); 
    var datetime = "Last Sync: " + currentdate.getDate() + "/"
                    + (currentdate.getMonth()+1)  + "/" 
                    + currentdate.getFullYear() + " @ "  
                    + currentdate.getHours() + ":"  
                    + currentdate.getMinutes() + ":" 
                    + currentdate.getSeconds();
    // console.log("Realtime Offre completed: "+datetime);
  })

 }, 600000);




// client.on('serverNewMember',user =>{
//   console.log(user);
//     message.channel.send(regles);
// });

// Create an event listener for messages
client.on('message', message => {
  var stream = T.stream('statuses/filter', { track: ['#3DvsCovid19', '#resistancecovid'], language: ['fr'] })
  var faq= client.channels.find(channel => channel.name==="faq");
  var presentation= client.channels.find(channel => channel.name==="presentation");
  var generalfr= client.channels.find(channel => channel.name==="general-fr");
  var generalen= client.channels.find(channel => channel.name==="general-en");
  var respirateur= client.channels.find(channel => channel.name==="respirateur");
  var manifeste= client.channels.find(channel => channel.name==="manifeste");
  var devtools= client.channels.find(channel => channel.name==="dev-tools");
  var faceshieldev= client.channels.find(channel => channel.name==="faceshieldev");
  var liege= client.channels.find(channel => channel.name==="liege");
  var bruxelles= client.channels.find(channel => channel.name==="bruxelles");
  var namur= client.channels.find(channel => channel.name==="namur");
  var hainaut= client.channels.find(channel => channel.name==="hainaut");
  var france= client.channels.find(channel => channel.name==="france");
  var suisse= client.channels.find(channel => channel.name==="suisse");
  var belgique= client.channels.find(channel => channel.name==="belgique");
  var luxembourg= client.channels.find(channel => channel.name==="luxembourg");
  var demande= client.channels.find(channel => channel.name==="demande-d-acces");
  var bw= client.channels.find(channel => channel.name==="brabant-wallon");
  var paris= client.channels.find(channel => channel.name==="paris");
  var marseille= client.channels.find(channel => channel.name==="marseille");



  

  // If the message is "ping"
  if (message.content === 'ping') {
    // Send "pong" to the same channel
    message.channel.send('pong');

  }
  
if (message.content === '!sources' || message.content === '!stl') {
    // Send "pong" to the same channel

    message.channel.send('**Last Version**');   
    message.channel.send('Faceshield3D [#resistancecovid] https://github.com/resistancecovid-com/faceshield/tree/master/faceshield_3DPrinting/faceshield_1.0.8');
    message.channel.send('Faceshield3D [Newshield]: https://www.myminifactory.com/fr/object/3d-print-115247');
    message.channel.send('https://www.prusaprinters.org/prints/27026-prusa-rc31-a4-sheet-face-shield-remix-quad-stack/files');
    message.channel.send('**Other Sources**');   
    message.channel.send('https://resistancecovid.com/catalogue.php');
    message.channel.send('https://www.prusaprinters.org/prints/26427-prusa-protective-face-shield-rc1-rc2-remix-rc3-eas/files');
    message.channel.send('https://www.prusaprinters.org/prints/27026-prusa-rc31-a4-sheet-face-shield-remix-quad-stack/files');

  }

    if (message.content === '!tutos') {
        // Send "pong" to the same channel
        message.channel.send('**Tutos**');    
        message.channel.send('Faceshield3D: https://wiki.resistancecovid.com/doku.php?id=tuto-prusa-shield-rc1-rc2-fr');
        message.channel.send('Faceshield3CNC: https://gitlab.com/fablab-ulb/projects/coronavirus/protective-face-shields/-/tree/master/PFC-Headband-Flexible-LaserCut');
        message.channel.send('Valvula Venturi: https://wiki.resistancecovid.com/doku.php?id=valve_respiratoire_rc1');



      }
  if (message.content === '!recap') {
      // Send "pong" to the same channel
      message.channel.send('https://wiki.resistancecovid.com/doku.php?id=synthese-discutions');
    }
  
    if (message.content === '!stock') {
      // Send "pong" to the same channel
      message.channel.send('**Stock**');    
      message.channel.send('Possibilitées de faire des commandes groupées ! Passer par les référents si y en a qui ont des contacts directes');    
      message.channel.send('https://3donline.be/');
      message.channel.send('https://www.mantec.be/fr/');
      message.channel.send('https://r3dsrl.odoo.com/shop ');
      message.channel.send('https://www.gotronic.fr/ email:contact@gotronic.fr')
      message.channel.send('https://www.farnell.com/ --> x4n4');
    }
  

   // If the message is "ping"
    if (message.content === '!inprogress') {
      // Send "pong" to the same channel
       message.channel.send(`Liste des projets en cours : <#${respirateur.id}> ,<#${manifeste.id}>,<#${devtools.id}>,<#${faceshieldev.id}>`);
    }
        if (message.content === '!cellules') {
      // Send "pong" to the same channel
       message.channel.send(`Liste des cellules **Pays** en cours : \n<#${belgique.id}> \n<#${france.id}>\n<#${suisse.id}>\n<#${luxembourg.id}>`);
       message.channel.send(`Liste des cellules **régions/province** en cours: \n<#${liege.id}> \n<#${bruxelles.id}>\n<#${namur.id}>\n<#${hainaut.id}>\n<#${luxembourg.id}>\n<#${hainaut.id}>\n<#${bw.id}>\n<#${paris.id}>\n<#${marseille.id}>`);
       message.channel.send('Vous pouvez aussi maintenant notifier tout les membres de votre cellule en tapant @nomdelacellule');


    }



 // If the message is "ping"
  if (message.content === '!welcome') {
    // Send "pong" to the same channel
     message.channel.send(`Merci de passer par le Channel <#${presentation.id}>, pour toutes les questions <#${faq.id}> et hesitez pas à venir papoter dans <#${generalfr.id}>  ou <#${generalen.id}>`);
       message.channel.send(`Pour garantir une bonne communication, merci de suivre les étapes suivantes: \nEtape 1: préfixer ton pseudo par la mention pays, ville ou région - ex: [BXL] [FR-90];  \nEtape 2: Demandez un accès à ta cellule sur <#${demande.id}> \nEtape 3: Fais un tour sur ton canal de cellule régional - ex: #bruxelles, #france (ou demander un channel dédié)`);
  }

 

  var channel1= client.channels.find(channel => channel.name==="feed-data");
  var channeltwit= client.channels.find(channel => channel.name==="feed-twitter");
  stream.on('tweet', function (data) {
    //     fs.appendFile('twitter_log.txt', '\n Twitter :: \n', function (err) {
    //           if (err) throw err;
                
    //           });
if(data.in_reply_to_status_id== null && data.in_reply_to_status_id_str== null && data.in_reply_to_user_id== null && data.in_reply_to_user_id_str== null && data.in_reply_to_screen_name== null){
    // channeltwit.send('Sur Twitter ! ' + ' par : ' + data.user.name + ' @ ' + 'https://twitter.com/' + data.user.screen_name + '/status/' + data.id_str);

  }
    // console.log(tweet.user.name);
    // channeltwit.send('Sur Twitter ! ' + ' par : ' + tweet.user.name + ' @ ' + 'https://twitter.com/' + tweet.screen_name + '/status/' + tweet.id_str);
            // console.log('Twitter :: ', data);
            // if(data.in_reply_to_user_id_str!==null) {

            // }else {
            // fs.appendFile('twitter_log.txt', data,function (err) {
                  // if (err) throw err;
                    
                  // });
              // fs.readFile('twitter_log.txt',"UTF8", function (err,datatest) {
              //   if(datatest){
              //   console.log(datatest);
              //  var result = datatest.filter(function(e) {
              //    return e.id != data.id;
              //  });

              //  console.log(result);

                  //     var content = JSON.stringify(data);
                  //     fs.writeFile('twitter_log.txt', content, function (err) {
                  //       if (err) throw err;
                  //           console.log('Saved!',difftab.length);
                  //     });
                  //     channeltwit.send('Sur Twitter ! ' + ' par : ' + data.user.name + ' @ ' + 'https://twitter.com/' + data.user.screen_name + '/status/' + data.id_str);

                      
                  //   // }else{
                  //   //   // console.log("Pas de nouvelles offres!");
                  //   // }
                  // }else{
                  //   var content = JSON.stringify(data);
                  //   fs.appendFile('twitter_log.txt', content, function (err) {
                  //     if (err) throw err;
                  //         console.log('Saved!');
                  //   });
                  // }
                // }
                //   });
            

  })

  if (message.content.indexOf('!help') === 0) {
	var regles='Welcome voici le bot de monitoring de Resistancecovid \n Fonctions : **! fonctions** ';
    message.channel.send(regles);
	
	}
  if(message.content.indexOf('!things')===0){
        var context = message.content;
        var ticker=context.substring(7);
        var initializePromise = gethingerverse(ticker);
        initializePromise.then(function(result) {
            if(result[0] || result.error!="not_authorized" ){
              var things=result;
              channel1.send("Il y a ** "+things.length+ " paterns ** sur thingerverse pour ta recherche sur "+ticker);

              }if(context.length>7){
                things.forEach((value, key, thisMap) => {
                  message.author.send("Derniers pattern sorti sur thinngerverse ** "+value.name+ "  **  source : "+value.public_url);
                  })
              }else{
              channel1.send("[API]Il y a pas de result");

            }

          }, function(err) {
              console.log(err);
          })

    }

});







// Log our bot in
client.login(token);

