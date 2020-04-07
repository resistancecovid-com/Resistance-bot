/*
  A commands pong bot, whenever you send "commands", it replies "pong".
*/
const request = require("request");
const fs = require('fs');
const thingiverse = require('../node_modules/thingiverse-js');
var Twit = require('twit')

var T = new Twit({
    consumer_key: 'XXX',
    //Consumer Secret (API Secret)
    consumer_secret: 'XXX',
    //Your Access Token
    access_token: 'XXX',
    //Your  Access Token Secret
    access_token_secret: 'XXX',
    timeout_ms: 60 * 1000,  // optional HTTP request timeout to apply to all requests.
    strictSSL: true,     // optional - requires SSL certificates to be valid.
})

function covid19belgium() {
    // Setting URL and headers for request
    var options = {
        url: 'https://raw.githubusercontent.com/eschnou/covid19-be/master/covid19-belgium.json',

    };
    // Return new promise 
    return new Promise(function (resolve, reject) {
        // Do async job
        request.get(options, function (err, resp, body) {
            if (err) {
                reject(err);
            } else {
                if (body) {
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
        url: "https://api.github.com/repos/" + repos + "/commits",
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36'
        }

    };
    // Return new promise 
    return new Promise(function (resolve, reject) {
        // Do async job
        request.get(options, function (err, resp, body) {
            if (err) {
                reject(err);
                console.log(err)
            } else {
                if (body) {
                    // console.log(body);
                    var obj = JSON.parse(body);
                    resolve(obj);

                }
            }
        })
    })
}


function Newcas(client, message, token) {
    var channel1 = client.channels.find(channel => channel.name === 'feed-data');

    var initializePromise = covid19belgium(token);
    initializePromise.then(function (result) {

        fs.readFile('newscas.txt', "UTF8", function (err, data) {
            // if (err) throw err;
            if (data) {
                var dataparsed = JSON.parse(data);
                var datalong = dataparsed.length;
                var resultlong = result.length;
                console.log(datalong);
                console.log(resultlong);
                if (datalong < resultlong && result) {
                    var diff = Number(resultlong - datalong);
                    var difftab = result.filter(function (obj) {
                        return obj.date > dataparsed[datalong - 1].date;
                    })
                    var content = JSON.stringify(result);
                    fs.writeFile('newscas.txt', content, function (err) {
                        if (err) throw err;
                        console.log('Saved!', difftab.length);
                    });
                    difftab.forEach((value, key, thisMap) => {
                        var date = value.date;
                        var tests = 0 + Number(value.daily_tests);
                        var daily_cases = 0 + Number(value.daily_cases);
                        var cumul_tests = 0 + Number(value.cumul_tests);
                        var hospitalized = 0 + Number(value.hospitalized);
                        channel1.send("**[NEWS]** Pour le " + value.date + " Nombre de tests journalier: " + tests + "** | ** Nombres de cas répertoriés:" + daily_cases + "** | ** Ensemble des tests cumulés :" + cumul_tests + "** | ** Nombre hospitalisé:" + hospitalized + " ")
                    })

                } else {
                    console.log("Pas de nouvelles offres!");
                }
            } else {
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
    }, function (err) {
        console.log(err);
    })

}

function gethingerverse(ticker) {
    const token = 'c29def8a6f2e80742780035a8bc2c42e';
    return new Promise(function (resolve, reject) {
        var tag = "search?name=" + ticker + "&q=" + ticker + "&type=things&sort=newest"
        thingiverse(tag, {token}).then(res => {
            resolve(res.body);
        }).catch(err => {
            reject(err);
            console.log(thingiverse.getError(err.response));
        });
    })

}


function getMonitor(client, id, token, repo) {
    var channel1 = client.channels.find(channel => channel.name === 'test');
    console.log("repo", repo);
    var initializePromise = github(repo);
    initializePromise.then(function (result) {
        var directory = id + ".txt";

        fs.readFile(directory, "UTF8", function (err, data) {
            if (data) {
                if (result[0] > data[0] && result) {
                    var content = JSON.stringify(result[0]);
                    fs.writeFile(directory, content, function (err) {
                        if (err) throw err;
                        console.log('Saved!');
                    });

                    // difftab.forEach((value, key, thisMap) => {
                    // console.log("value",value);
                    channel1.send("**[NEWS github]** Pour le " + repo + "\n Last commit : https://github.com/" + repo + "/commit/" + result[0].sha + "\n avec le message" + result[0].commit.message);
                    // })

                } else {
                    console.log("Pas de nouvelles offres!");
                }
            } else {
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
    }, function (err) {
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


client.on("guildMemberAdd", (member) => {
    console.log(`New User "${member.user.username}" has joined "${member.guild.name}"`);
    member.guild.channels.find(c => c.name === "bienvenue").send(`Bienvenue <@${member.user.id}> comme nouveaux membre de la #resistancecovid!`);

    var faq = client.channels.find(channel => channel.name === "faq");
    var presentation = client.channels.find(channel => channel.name === "presentation");
    var generalfr = client.channels.find(channel => channel.name === "general-fr");
    var generalen = client.channels.find(channel => channel.name === "general-en");
    var respirateur = client.channels.find(channel => channel.name === "respirateur");
    var manifeste = client.channels.find(channel => channel.name === "manifeste");
    var devtools = client.channels.find(channel => channel.name === "dev-tools");
    var demande = client.channels.find(channel => channel.name === "demande-d-acces");
Ë

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


