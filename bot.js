require("dotenv").config();
const QuickChart = require('quickchart-js');
var mysql = require('mysql');
const { Client, DiscordAPIError, Attachment } = require("discord.js");
const fs = require("fs");
const chartconf = require('./modulesconf');
const puppeteer = require("puppeteer-extra");
const schedule = require('node-schedule');
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

const AdblockerPlugin = require("puppeteer-extra-plugin-adblocker");
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

const fetch = require("node-fetch");
const axios = require("axios");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const Discord = require("discord.js");
const console = require("console");

const client = new Discord.Client(
  {intents: ["GUILDS", "GUILD_MESSAGES" , "GUILD_WEBHOOKS" ,"GUILD_SCHEDULED_EVENTS"]}
  ); //create new client intent

const PREFIX = "!";

client.on("ready", () => {
  console.log("You login Glenn");
  console.log("Servers:");
  client.guilds.cache.forEach((guild) => {
    console.log(" - " + guild.name);
  });
});
client.on("messageCreate", (message) => {
  if (message.author.bot) return;
  if (message.content.startsWith(PREFIX)) {
    const [CMD_NAME, ...args] = message.content
      .trim()
      .substring(PREFIX.length)
      .split(/\s+/);

    if (CMD_NAME === "chsb-dead") {
      if (args.length === 0) return message.reply("Give me an item name sier");
      var items = args.join(" ");
      var data1 = {
        tradezone: "4",
        category: "0",
        term: items,
      };
      var sentdata = Object.keys(data1)
        .map((key) => key + "=" + data1[key])
        .join("&");
      var url = "https://www.dfprofiler.com/newmarket/search";

      axios({
        method: "post",
        url: url,
        data: sentdata,
      })
        .then(function (response) {
          var result = response.data;

          var resname1 = result[1].name;
          var resprice1 = result[1].price;
          var commaprice1 = thousands_separators(resprice1);
          var resseller1 = result[1].sellerName;

          var resname2 = result[2].name;
          var resprice2 = result[2].price;
          var commaprice2 = thousands_separators(resprice2);
          var resseller2 = result[2].sellerName;

          var resname3 = result[3].name;
          var resprice3 = result[3].price;
          var commaprice3 = thousands_separators(resprice3);
          var resseller3 = result[3].sellerName;

          var resname4 = result[4].name;
          var resprice4 = result[4].price;
          var commaprice4 = thousands_separators(resprice4);
          var resseller4 = result[4].sellerName;

          var resname5 = result[5].name;
          var resprice5 = result[5].price;
          var commaprice5 = thousands_separators(resprice5);
          var resseller5 = result[5].sellerName;

          const exampleEmbed = new Discord.MessageEmbed()
            .setColor("#3c00ff")
            .setTitle("Market Checker Lowest Price 💳")

            .addFields(
              { name: "#1 Item Name", value: resname1, inline: true },
              { name: "Price", value: commaprice1, inline: true },
              { name: "Seller", value: resseller1, inline: true }
            )
            .addFields(
              { name: "#2 Item Name", value: resname2, inline: true },
              { name: "Price", value: commaprice2, inline: true },
              { name: "Seller", value: resseller2, inline: true }
            )
            .addFields(
              { name: "#3 Item Name", value: resname3, inline: true },
              { name: "Price", value: commaprice3, inline: true },
              { name: "Seller", value: resseller3, inline: true }
            )
            .addFields(
              { name: "#4 Item Name", value: resname4, inline: true },
              { name: "Price", value: commaprice4, inline: true },
              { name: "Seller", value: resseller4, inline: true }
            )
            .addFields(
              { name: "#5 Item Name", value: resname5, inline: true },
              { name: "Price", value: commaprice5, inline: true },
              { name: "Seller", value: resseller5, inline: true }
            )
            .setTimestamp()
            .setFooter({text: "Kannazuki Bot 🤖"});
            message.channel.send({ embeds: [exampleEmbed] });
        })
        .catch(function (error) {
          message.channel.send("Item not found mister");
        });
    } else if (CMD_NAME === "cts") {
      getCTS().then((data) => {
        const exampleEmbed = new Discord.MessageEmbed();
        exampleEmbed.setColor("#3c00ff");
        exampleEmbed.setTitle("🔥Current Top 10 - Weekly CTS");
        for (var i = 0; i < data.length; i++) {
          exampleEmbed.addFields({
            name: "#" + data[i]["rank"] + " " + data[i]["name"],
            value: data[i]["score"] + " EXP",
          });
        }
        exampleEmbed.setTimestamp();
        exampleEmbed.setFooter({text: "Kannazuki Bot 🤖"});
        message.channel.send({ embeds: [exampleEmbed] });
      });
    } else if (CMD_NAME === "help") {
      const exampleEmbed = new Discord.MessageEmbed()
        .setColor("#3c00ff")
        .setTitle("This Bot is for Kannazuki-DF")
        .addFields({ name: "List Available Commands:", value: "\u200B" })
        .addFields({ name: "!chsb", value: "-To check DF marketplace SB (DOWN too lazy to revise the code :P" })
        .addFields({
          name: "!cts",
          value: "-Show Top 10 weekly Clan Top Survivor",
        })
        .addFields({ name: "!profile playername", value: "-Player profile" })
        .addFields({ name: "!1d,7d,1m,6m <watchlist>", value: "History Chart" })
        .addFields({ name: "!private playername", value: "-Show Player Private Trade" })
        .setTimestamp()
        .setFooter({text: "Kannazuki Bot 🤖 -GlennRhee"});
        message.channel.send({ embeds: [exampleEmbed] });
    } else if (CMD_NAME === "boss") {
      (async () => {
        const response = await fetch("https://www.dfprofiler.com/bossmap/json", {
          "credentials": "include",
          "headers": {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0",
              "Accept": "application/json, text/javascript, */*; q=0.01",
              "Accept-Language": "en-US,en;q=0.5",
              "X-Requested-With": "XMLHttpRequest"
          },
          "referrer": "https://www.dfprofiler.com/bossmap",
          "method": "GET",
          "mode": "cors"
      });

        const data = await response.json();
        var currentbossarr = [];
        var lastbossarr = [];
        // const sertime = data["server"]["time"];
        // var servertime = unixTime(sertime);

        for (var i = 0; i < Object.keys(data).length; i++) {
          var currentbossobj = {};
          var lastbossobj = {};
          var key = "" + i;
          if (data[key] != null && data[key]["dfp_datatype"] != null) {
            switch (data[key]["dfp_datatype"]) {
              case "boss": {
                const boss_locations = data[key]["locations"];
                const boss_name = data[key]["special_enemy_type"];
                const end_time = data[key]["end_time"];
                const unixtime = sertime - end_time;

                if (unixtime > 0) {
                  const bosstime = unixtime / 60;
                  const bossremain = Math.trunc(bosstime);
                  const timepassed = "True";
                  const bdistanceobj = getNear(boss_locations);
                  const boss = getBoss(bdistanceobj, boss_locations);

                  currentbossobj["boss_name"] = boss_name;
                  currentbossobj["boss_location"] = boss;
                  currentbossobj["timeleft"] = bossremain;
                  currentbossobj["timepassed"] = timepassed;
                  currentbossarr.push(currentbossobj);
                } else {
                  const bosstime = unixtime / 60;
                  const timeleft = Math.abs(bosstime);
                  const bossremain = Math.trunc(timeleft);
                  const timepassed = "False";
                  const bdistanceobj = getNear(boss_locations);
                  const boss = getBoss(bdistanceobj, boss_locations);

                  currentbossobj["boss_name"] = boss_name;
                  currentbossobj["boss_location"] = boss;
                  currentbossobj["timeleft"] = bossremain;
                  currentbossobj["timepassed"] = timepassed;
                  currentbossarr.push(currentbossobj);
                }

                break;
              }

              case "oldboss": {
                console.log('last boss')
                const boss_locations = data[key]["locations"];
                const boss_name = data[key]["special_enemy_type"];
                const end_time = data[key]["end_time"];
                const unixtime = sertime - end_time;

                if (unixtime > 0) {
                  const bosstime = unixtime / 60;
                  const bossremain = Math.trunc(bosstime);
                  const timepassed = "True";
                  const bdistanceobj = getNear(boss_locations);
                  const boss = getBoss(bdistanceobj, boss_locations);

                  lastbossobj["boss_name"] = boss_name;
                  lastbossobj["boss_location"] = boss;
                  lastbossobj["timeleft"] = bossremain;
                  lastbossobj["timepassed"] = timepassed;
                  lastbossarr.push(lastbossobj);
                } else {
                  const bosstime = unixtime / 60;
                  const timeleft = Math.abs(bosstime);
                  const bossremain = Math.trunc(timeleft);
                  const timepassed = "False";
                  const bdistanceobj = getNear(boss_locations);
                  const boss = getBoss(bdistanceobj, boss_locations);

                  lastbossobj["boss_name"] = boss_name;
                  lastbossobj["boss_location"] = boss;
                  lastbossobj["timeleft"] = bossremain;
                  lastbossobj["timepassed"] = timepassed;
                  lastbossarr.push(lastbossobj);
                }

                break;
              }
            }
          }
        }
        console.log("CURRENT")
        console.log(currentbossarr)

        console.log("LAST")
        console.log(lastbossarr)

        const currentBoss = new Discord.MessageEmbed();
        currentBoss.setColor("#3c00ff");
        currentBoss.setTitle("Current Boss Cycle SB");

        for (var i = 0; i < currentbossarr.length; i++) {
          if (currentbossarr[i]["timepassed"] === "True") {
            if (currentbossarr[i]["boss_location"].length === 0) {
              currentBoss.addFields({
                name: "🧟‍♂️" + currentbossarr[i]["boss_name"],
                value: "No nearby location",
              });
            } else {
              currentBoss.addFields({
                name:
                  "🧟‍♂️" +
                  currentbossarr[i]["boss_name"] +
                  " [EO " +
                  currentbossarr[i]["timeleft"] +
                  " mins ago]",
                value: "Locations: " + currentbossarr[i]["boss_location"],
              });
            }
          } else {
            if (currentbossarr[i]["boss_location"].length === 0) {
              currentBoss.addFields({
                name: "🧟‍♂️" + currentbossarr[i]["boss_name"],
                value: "No nearby location",
              });
            } else {
              currentBoss.addFields({
                name:
                  "🧟‍♂️" +
                  currentbossarr[i]["boss_name"] +
                  " [" +
                  currentbossarr[i]["timeleft"] +
                  " mins left]",
                value: "Locations: " + currentbossarr[i]["boss_location"],
              });
            }
          }
        }
        currentBoss.setTimestamp();
        currentBoss.setFooter("Kannazuki Bot🤖");

        const lastBoss = new Discord.MessageEmbed();
        lastBoss.setColor("#3c00ff");
        lastBoss.setTitle("Last Boss Cycle SB");

        for (var v = 0; v < lastbossarr.length; v++) {
          if (lastbossarr[v]["timepassed"] === "True") {
            if (lastbossarr[v]["boss_location"].length === 0) {
              lastBoss.addFields({
                name: "🧟‍♂️" + lastbossarr[v]["boss_name"],
                value: "No nearby location",
              });
            } else {
              lastBoss.addFields({
                name:
                  "🧟‍♂️" +
                  lastbossarr[v]["boss_name"] +
                  " [EO " +
                  lastbossarr[v]["timeleft"] +
                  " mins ago]",
                value: "Locations: " + lastbossarr[v]["boss_location"],
              });
            }
          } else {
            if (lastbossarr[v]["boss_location"].length === 0) {
              lastBoss.addFields({
                name: "🧟‍♂️" + lastbossarr[v]["boss_name"],
                value: "No nearby location",
              });
            } else {
              lastBoss.addFields({
                name:
                  "🧟‍♂️" +
                  lastbossarr[v]["boss_name"] +
                  " [" +
                  lastbossarr[v]["timeleft"] +
                  " mins left]",
                value: "Locations: " + lastbossarr[v]["boss_location"],
              });
            }
          }
        }
        lastBoss.setTimestamp();
        lastBoss.setFooter("Kannazuki Bot🤖");

        if (currentbossarr.length === 0) {
          message.channel.send(lastBoss);
        } else {
          message.channel.send(currentBoss);
        }
      })();
    } else if (CMD_NAME === "chp13") {
      if (args.length === 0) return message.reply("Give me an item name sier");
      var items = args.join(" ");
      var data1 = {
        tradezone: "11", // Pres 13
        category: "0",
        search: items,
      };
      var sentdata = Object.keys(data1)
        .map((key) => key + "=" + data1[key])
        .join("&");
      var url =
        "http://meaty.dfprofiler.com/browsemarketplace.php?function=browseMarketWithCredits";

      axios({
        method: "post",
        url: url,
        data: sentdata,
      })
        .then(function (response) {
          var result = response.data;

          var resname1 = result[1].name;
          var resprice1 = result[1].price;
          var commaprice1 = thousands_separators(resprice1);
          var resseller1 = result[1].sellerName;

          var resname2 = result[2].name;
          var resprice2 = result[2].price;
          var commaprice2 = thousands_separators(resprice2);
          var resseller2 = result[2].sellerName;

          var resname3 = result[3].name;
          var resprice3 = result[3].price;
          var commaprice3 = thousands_separators(resprice3);
          var resseller3 = result[3].sellerName;

          const exampleEmbed = new Discord.MessageEmbed()
            .setColor("#3c00ff")
            .setTitle("Market Checker Lowest Price(P13) 💳")

            .addFields(
              { name: "#1 Item Name", value: resname1, inline: true },
              { name: "Price", value: commaprice1, inline: true },
              { name: "Seller", value: resseller1, inline: true }
            )
            .addFields(
              { name: "#2 Item Name", value: resname2, inline: true },
              { name: "Price", value: commaprice2, inline: true },
              { name: "Seller", value: resseller2, inline: true }
            )
            .addFields(
              { name: "#3 Item Name", value: resname3, inline: true },
              { name: "Price", value: commaprice3, inline: true },
              { name: "Seller", value: resseller3, inline: true }
            )
            .setTimestamp()
            .setFooter("Kannazuki Bot🤖");

          message.channel.send(exampleEmbed);
        })
        .catch(function (error) {
          message.channel.send("Item not found mister");
        });
    }else if (CMD_NAME === 'private'){
      if (args.length === 0) return message.reply("Hey! Give Me A Player Name");
      var playername = args.join(" ");
      getPlayerID(playername).then(data =>{
        if (data === "No data") {
          message.channel.send('Player "' + playername + '" is not found or not in database.'
          );
        }else{
          var playerid = data[0]['player_id'];
          getPrivateTrades(playerid).then(datalist =>{
            // console.log(datalist)
            // console.log(datalist.length)
            if(datalist.length !== 0){
              const exampleEmbed = new Discord.MessageEmbed()
              exampleEmbed.setColor("#3c00ff")
              exampleEmbed.setTitle(playername +' Current private trades')
              for(var i=1; i<datalist.length; i++){
               const price =  thousands_separators(datalist[i]['private_price'])
                
                exampleEmbed.addFields({ name: '['+i+'] '+datalist[i]['private_item']+'-'+datalist[i]['private_orgitem']+' for [$'+price+']', value:  'Buyer: '+datalist[i]['private_to_mem_id']+'('+datalist[i]['private_to']+')' })

              }
              exampleEmbed.setTimestamp()
              exampleEmbed.setFooter("Kannazuki Bot🤖");
      
              message.channel.send(exampleEmbed);
            }else{
              message.channel.send(playername+' doesnt have any private trade atm')
            }
          })
        }
      }).catch(function (error) {
        console.log('Error')
        console.log(error)
      });






    } else if (CMD_NAME === "chsez") {
      if (args.length === 0) return message.reply("Give me an item name sier");
      var items = args.join(" ");
      var data1 = {
        tradezone: "9", // Pres 13
        category: "0",
        search: items,
      };
      var sentdata = Object.keys(data1)
        .map((key) => key + "=" + data1[key])
        .join("&");
      var url =
        "http://meaty.dfprofiler.com/browsemarketplace.php?function=browseMarketWithCredits";

      axios({
        method: "post",
        url: url,
        data: sentdata,
      })
        .then(function (response) {
          var result = response.data;

          var resname1 = result[1].name;
          var resprice1 = result[1].price;
          var commaprice1 = thousands_separators(resprice1);
          var resseller1 = result[1].sellerName;

          var resname2 = result[2].name;
          var resprice2 = result[2].price;
          var commaprice2 = thousands_separators(resprice2);
          var resseller2 = result[2].sellerName;

          var resname3 = result[3].name;
          var resprice3 = result[3].price;
          var commaprice3 = thousands_separators(resprice3);
          var resseller3 = result[3].sellerName;

          const exampleEmbed = new Discord.MessageEmbed()
            .setColor("#3c00ff")
            .setTitle("Market Checker Lowest Price(SEZ)")

            .addFields(
              { name: "#1 Item Name", value: resname1, inline: true },
              { name: "Price", value: commaprice1, inline: true },
              { name: "Seller", value: resseller1, inline: true }
            )
            .addFields(
              { name: "#2 Item Name", value: resname2, inline: true },
              { name: "Price", value: commaprice2, inline: true },
              { name: "Seller", value: resseller2, inline: true }
            )
            .addFields(
              { name: "#3 Item Name", value: resname3, inline: true },
              { name: "Price", value: commaprice3, inline: true },
              { name: "Seller", value: resseller3, inline: true }
            )
            .setTimestamp()
            .setFooter("Kannazuki Bot🤖");

          message.channel.send(exampleEmbed);
        })
        .catch(function (error) {
          message.channel.send("Df Item not found");
        });
    } else if (CMD_NAME === "profile") {
      if (args.length === 0) return message.reply("Hey! Give Me A Player Name");
      var playername = args.join(" ");
      console.log(playername)
      if (!isNaN(playername)){
        console.log('not a number')
        const memberid = playername;
        (async () => {
          const response2 = await fetch(
            "http://www.hollowprestige.com/umbraco/api/df/getplayerstats?userId="+memberid+"",
            {
              credentials: "omit",
              headers: {
                "User-Agent":
                  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:81.0) Gecko/20100101 Firefox/81.0",
                Accept:
                  "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.5",
                "Upgrade-Insecure-Requests": "1",
                Pragma: "no-cache",
                "Cache-Control": "no-cache",
              },
              method: "GET",
              mode: "cors",
            }
          );
          const playerstats = await response2.text();
          const split1 = await playerstats.split(">");
          const last = split1[1];

          const data = last.split("<");
          const playerData = JSON.parse(data[0]);
          console.log(playerData)
          var idmember = playerData["id_member"];
          var namemember = playerData["df_name"];

          var wts = thousands_separators(playerData["df_expdeath_weekly"]);
          var currentcash = thousands_separators(playerData["df_cash"]);
          var bankcash = thousands_separators(playerData["df_bankcash"]);
          var creds = thousands_separators(playerData["df_credits"]);
          var myinv = [];
          var totalslot = playerData["df_invslots"];
          var xp = playerData["df_positionx"];
          var yp = playerData["df_positiony"];
          var currentPosition = getCorPlayer(xp, yp);

          for (var i = 0; i < totalslot; i++) {
            const inv = playerData["df_inv" + i + "_type"];
            const inven = "Slot " + i + " : " + inv + "\n";
            myinv.push(inven);
          }

          const inv = myinv.join("");

          const exampleEmbed = new Discord.MessageEmbed();
          exampleEmbed.setColor("#3c00ff");
          exampleEmbed.setTitle("Player Profile of " + namemember + "");
          exampleEmbed.setImage("http://www.dfprofiler.com/signaturereplicate.php?profile="+idmember+'');

          exampleEmbed.addFields({
            name: "ℹ️Extra Information:",
            value:
              "```🇨🇭Player HP: " +
              `${playerData["df_hpcurrent"]}` +
              "/" +
              `${playerData["df_hpmax"]}` +
              "\n⚔️Weekly TS: " +
              wts +
              "\n🗺️Current Position: " +
              currentPosition +
              "\n🛡️Armour name: " +
              `${playerData["df_armourname"]}` +
              " " +
              `${playerData["df_armourhp"]}` +
              "/" +
              `${playerData["df_armourhpmax"]}` +
              "\n💰Current Cash: " +
              currentcash +
              "\n🏦Bank Cash: " +
              bankcash +
              "\n🚮Credits: " +
              creds +
              " ```",
          });

          exampleEmbed.addFields({
            name: "🎒Current Inventory:",
            value: "```" + inv + "```",
          });

          exampleEmbed.setTimestamp();
          exampleEmbed.setFooter({text: "Kannazuki Bot 🤖"});
          message.channel.send({ embeds: [exampleEmbed] });
          //message.channel.send('Additonal Information:\n```Player HP: '+`${playerData['df_expdeath_weekly']}`+'\nWeekly TS: '+`${playerData['df_expdeath_weekly']}`+'\n Armour name: '+`${playerData['df_armourname']}`+' '+`${playerData['df_armourhp']}`+'/'+`${playerData['df_armourhpmax']}`+'\n    ```');
        })();



      }else{
        var string1 = playername;
        var rep = string1.split(' ').join('_');
        const playername_link = rep;

        var string2 = playername;
        var replus = string2.split(' ').join('+');
        const playername_plus = replus;
        // console.log('a number');
        (async () => {
          const response =  await fetch("https://www.dfprofiler.com/profile/autocomplete/"+playername_link+"", {
            "credentials": "include",
            "headers": {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0",
                "Accept": "application/json, text/javascript, */*; q=0.01",
                "Accept-Language": "en-US,en;q=0.5",
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "X-Requested-With": "XMLHttpRequest"
            },
            "referrer": "https://www.dfprofiler.com/",
            "body": "dataType=json&query="+playername_plus+"",
            "method": "POST",
            "mode": "cors"
        });
  
          var data = await response.json();
  
          if (!data.length){
            message.channel.send(
              'Player "' + playername + '" is not found or not in database.'
            );
          }else{
            const memberid = data[0]['player_id'];
            (async () => {
              const response2 = await fetch(
                "http://www.hollowprestige.com/umbraco/api/df/getplayerstats?userId="+memberid+"",
                {
                  credentials: "omit",
                  headers: {
                    "User-Agent":
                      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:81.0) Gecko/20100101 Firefox/81.0",
                    Accept:
                      "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                    "Accept-Language": "en-US,en;q=0.5",
                    "Upgrade-Insecure-Requests": "1",
                    Pragma: "no-cache",
                    "Cache-Control": "no-cache",
                  },
                  method: "GET",
                  mode: "cors",
                }
              );
              const playerstats = await response2.text();
              const split1 = await playerstats.split(">");
              const last = split1[1];
  
              const data = last.split("<");
              const playerData = JSON.parse(data[0]);
  
              var idmember = playerData["id_member"];
              var namemember = playerData["df_name"];
  
              var wts = thousands_separators(playerData["df_expdeath_weekly"]);
              var currentcash = thousands_separators(playerData["df_cash"]);
              var bankcash = thousands_separators(playerData["df_bankcash"]);
              var creds = thousands_separators(playerData["df_credits"]);
              var myinv = [];
              var totalslot = playerData["df_invslots"];
              var xp = playerData["df_positionx"];
              var yp = playerData["df_positiony"];
              var currentPosition = getCorPlayer(xp, yp);
  
              for (var i = 0; i < totalslot; i++) {
                const inv = playerData["df_inv" + i + "_type"];
                const inven = "Slot " + i + " : " + inv + "\n";
                myinv.push(inven);
              }
  
              const inv = myinv.join("");
  
              const exampleEmbed = new Discord.MessageEmbed();
              exampleEmbed.setColor("#3c00ff");
              exampleEmbed.setTitle("Player Profile of " + namemember + "");
              exampleEmbed.setImage("http://www.dfprofiler.com/signaturereplicate.php?profile="+idmember+'');
  
              exampleEmbed.addFields({
                name: "ℹ️Extra Information:",
                value:
                  "```🇨🇭Player HP: " +
                  `${playerData["df_hpcurrent"]}` +
                  "/" +
                  `${playerData["df_hpmax"]}` +
                  "\n⚔️Weekly TS: " +
                  wts +
                  "\n🗺️Current Position: " +
                  currentPosition +
                  "\n🛡️Armour name: " +
                  `${playerData["df_armourname"]}` +
                  " " +
                  `${playerData["df_armourhp"]}` +
                  "/" +
                  `${playerData["df_armourhpmax"]}` +
                  "\n💰Current Cash: " +
                  currentcash +
                  "\n🏦Bank Cash: " +
                  bankcash +
                  "\n🚮Credits: " +
                  creds +
                  " ```",
              });
  
              exampleEmbed.addFields({
                name: "🎒Current Inventory:",
                value: "```" + inv + "```",
              });
  
              exampleEmbed.setTimestamp();
              exampleEmbed.setFooter({text: "Kannazuki Bot 🤖"});
              message.channel.send({ embeds: [exampleEmbed] });
              //message.channel.send('Additonal Information:\n```Player HP: '+`${playerData['df_expdeath_weekly']}`+'\nWeekly TS: '+`${playerData['df_expdeath_weekly']}`+'\n Armour name: '+`${playerData['df_armourname']}`+' '+`${playerData['df_armourhp']}`+'/'+`${playerData['df_armourhpmax']}`+'\n    ```');
            })();
          }
  
        })();
      }
    } else if (CMD_NAME === "6m"){
      var itemname = args.join(" ");
      let itemname2 = itemname.toString();
      console.log(itemname2);
      ///DB CNNCTION OPEN
      const consql = mysql.createConnection({
        host: process.env.HOST_DB,  
        user: process.env.USER_DB,
        password: process.env.PASS_DB,
        database: process.env.DB_DB
      });

      consql.connect(function(err) {
        if (err) throw err;
        consql.query("SELECT *, DATE_FORMAT(datetimestamp,'%m-%d-%Y') AS newDate FROM pricehistory3 WHERE itemname= '"+itemname2+"' AND datetimestamp >= (NOW() - INTERVAL 6 MONTH) ORDER BY newDate ASC;", function (err, result, fields) {
          if (err) throw err;
          if(result.length > 0){
            var newdata = [];
            result.forEach(row => {
              newdata.push([row.newDate,row.itemprice]);
              });
                //START CHART
                const myChart = new QuickChart();
                  myChart.setConfig(chartconf.months6(newdata,itemname2));
                  ///SEND CHART
                  getUrl(myChart).then(data =>{
                    console.log(data)
                       message.channel.send(`Here's what we got ${data}`);
                       }).catch(function (error) {
                     console.log('Error')
                     console.log(error)
                   });        
          }else{
            message.channel.send(`The item that your trying to search is not on my Database see watchlist $show-watchlist`);
          }

       });
   });
} else if(CMD_NAME === "1d"){
  var itemname = args.join(" ");
  let itemname2 = itemname.toString();
  console.log(itemname2);
  ///DB CNNCTION OPEN
  const consql = mysql.createConnection({
    host: process.env.HOST_DB,  
    user: process.env.USER_DB,
    password: process.env.PASS_DB,
    database: process.env.DB_DB
  });

  consql.connect(function(err) {
    if (err) throw err;
    consql.query("SELECT *, DATE_FORMAT(datetimestamp,'%m-%d-%Y %H:%i') AS newDate FROM pricehistory3 WHERE itemname= '"+itemname2+"' AND datetimestamp >= (NOW() - INTERVAL 1 DAY) ORDER BY newDate ASC;", function (err, result, fields) {
      if (err) throw err;
      if(result.length > 0){
        var newdata = [];
        result.forEach(row => {
          newdata.push([row.newDate,row.itemprice]);
          });
            //START CHART
            const myChart = new QuickChart();
              myChart.setConfig(chartconf.day1(newdata,itemname2));
              ///SEND CHART
              getUrl(myChart).then(data =>{
                console.log(data)
                   message.channel.send(`Here's what we got ${data}`);
                   }).catch(function (error) {
                 console.log('Error')
                 console.log(error)
               });        
      }else{
        message.channel.send(`The item that your trying to search is not on my Database see watchlist $show-watchlist`);
      }

   });
});





} else if(CMD_NAME === "7d"){
  var itemname = args.join(" ");
  let itemname2 = itemname.toString();
  console.log(itemname2);
  ///DB CNNCTION OPEN
  const consql = mysql.createConnection({
    host: process.env.HOST_DB,  
    user: process.env.USER_DB,
    password: process.env.PASS_DB,
    database: process.env.DB_DB
  });

  consql.connect(function(err) {
    if (err) throw err;
    consql.query("SELECT *, DATE_FORMAT(datetimestamp,'%m-%d-%Y') AS newDate FROM pricehistory3 WHERE itemname= '"+itemname2+"' AND datetimestamp >= (NOW() - INTERVAL 7 DAY) ORDER BY newDate ASC;", function (err, result, fields) {
      if (err) throw err;
      if(result.length > 0){
        var newdata = [];
        result.forEach(row => {
          newdata.push([row.newDate,row.itemprice]);
          });
            //START CHARTnbnbn
            const myChart = new QuickChart();
              myChart.setConfig(chartconf.day7(newdata,itemname2));
              ///SEND CHART
              getUrl(myChart).then(data =>{
                   message.channel.send(`Here's what we got ${data}`);
                   }).catch(function (error) {
                 console.log('Error')
               });        
      }else{
        message.channel.send(`The item that your trying to search is not on my Database see watchlist $show-watchlist`);
      }
      console.log(result);
   });
});

}else if(CMD_NAME === "1m"){
  var itemname = args.join(" ");
  let itemname2 = itemname.toString();
  console.log(itemname2);
  ///DB CNNCTION OPEN
  const consql = mysql.createConnection({
    host: process.env.HOST_DB,  
    user: process.env.USER_DB,
    password: process.env.PASS_DB,
    database: process.env.DB_DB
  });

  consql.connect(function(err) {
    if (err) throw err;
    consql.query("SELECT *, DATE_FORMAT(datetimestamp,'%m-%d-%Y') AS newDate FROM pricehistory3 WHERE itemname= '"+itemname2+"' AND datetimestamp >= (NOW() - INTERVAL 1 MONTH) ORDER BY newDate ASC;", function (err, result, fields) {
      if (err) throw err;
      if(result.length > 0){
        var newdata = [];
        result.forEach(row => {
          newdata.push([row.newDate,row.itemprice]);
          });
            //START CHART
            const myChart = new QuickChart();
              myChart.setConfig(chartconf.month1(newdata,itemname2));
              ///SEND CHART
              getUrl(myChart).then(data =>{
                console.log(data)
                   message.channel.send(`Here's what we got ${data}`);
                   }).catch(function (error) {
                 console.log('Error')
                 console.log(error)
               });        
               console.log(newdata);
      }else{
        message.channel.send(`The item that your trying to search is not on my Database see watchlist $show-watchlist`);
      }
      console.log(result);

   });
});
} else if(CMD_NAME === "add-watchlist"){
  var itemname = args.join(" ");
  let itemstring = itemname.toString();

  const consql = mysql.createConnection({
    host: process.env.HOST_DB,  
    user: process.env.USER_DB,
    password: process.env.PASS_DB,
    database: process.env.DB_DB
  });

  consql.connect(function(err) {
    if (err) throw err;
    consql.query("INSERT INTO watchlist (items) VALUES ('"+itemstring+"');", function (err, result, fields) {
      if (err) throw err;
      console.log(result.affectedRows);
      console.log(itemstring+' has been added to my watchlist');
      message.channel.send(`${itemstring} has been added to my watchlist`);
    });  
  });
}else if(CMD_NAME === "show-watchlist"){
  var itemname = args.join(" ");
  let itemstring = itemname.toString();

  const consql = mysql.createConnection({
    host: process.env.HOST_DB,  
    user: process.env.USER_DB,
    password: process.env.PASS_DB,
    database: process.env.DB_DB
  });

  consql.connect(function(err) {
    if (err) throw err;
    consql.query("SELECT * FROM watchlist;", function (err, result, fields) {
      if (err) throw err;
      if(result.length > 0){
        var watchlist = [];
        // result.forEach(row => {
        //   watchlist.push([row.items]);
        //   });
          const exampleEmbed = new Discord.MessageEmbed();
          exampleEmbed.setColor("#3c00ff");
          exampleEmbed.setTitle("🔥On Kanna's Watchlist🔥");
          for (var i = 0; i < result.length; i++) {
            exampleEmbed.addFields({
              name: "-------------",
              value: result[i]["items"],
            });
          }
          message.channel.send({ embeds: [exampleEmbed] });
      }
    });  
  });
}else {
      message.channel.send("Invalid Command");
    }
  }
  function thousands_separators(num) {
    var num_parts = num.toString().split(".");
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return num_parts.join(".");
  }

  function getCorPlayer(xp, yp) {
    const bx = xp;
    const by = yp;

    if (bx === "0" && by === "0") {
      var bossfinal = "Unknown/Ghost";
      return bossfinal;
    } else {
      const sbx = 1054;
      const sby = 987;

      var xstep = bx - sbx;
      var ystep = by - sby;

      var xcor = Math.abs(xstep);
      var ycor = Math.abs(ystep);

      const x = Math.sign(xstep);
      const y = Math.sign(ystep);

      if (x === 0 && y === 1) {
        ///  DOOOOWN ONLY
        var bossfinal = "" + ycor + "D from Secronom";
        return bossfinal;
      } else if (x === 0 && y === -1) {
        ///  UUUUPP ONLY
        var bossfinal = "" + ycor + "U from Secronom";
        return bossfinal;
      } else if (x === 1 && y === 0) {
        ///   RIIIGHT ONLY
        var bossfinal = "" + xcor + "R from Secronom";
        return bossfinal;
      } else if (x === -1 && y === 0) {
        ///  LEEEFFT ONLY
        var bossfinal = "" + xcor + "L from Secronom";
        return bossfinal;
      } else if (x === 1 && y === 1) {
        ///  DOWN -- RIGHT
        var bossx = xcor + "R";
        var bossy = ycor + "D from Secronom";
        var bossfinal = bossx + " " + bossy;
        return bossfinal;
      } else if (x === -1 && y === -1) {
        ///  LEFT -- UP
        var bossx = xcor + "L";
        var bossy = ycor + "U from Secronom";
        var bossfinal = bossx + " " + bossy;
        return bossfinal;
      } else if (x === -1 && y === 1) {
        /// DOWN -- LEFT
        var bossx = ycor + "D";
        var bossy = xcor + "L from Secronom";
        var bossfinal = bossx + " " + bossy;
        return bossfinal;
      } else {
        ///  RIGT -- UP
        var bossx = xcor + "R";
        var bossy = ycor + "U  from Secronom";
        var bossfinal = bossx + " " + bossy;
        return bossfinal;
      }
    }
  }

  function getNear(boss_locations) {
    var cord = [];

    for (n = 0; n < boss_locations.length; n++) {
      var obj = {};
      const x1 = 1054;
      const y1 = 987;

      const x2 = boss_locations[n]["0"];
      const y2 = boss_locations[n]["1"];

      const bossdistance = Math.hypot(x2 - x1, y2 - y1);

      //console.log(res);
      if (bossdistance <= 6) {
        obj["boss_index"] = n;
        obj["boss_distance"] = bossdistance;
        cord.push(obj);
      }
    }

    return cord;
  }

  function getCorBoss(arrayloc) {
    const bx = arrayloc[0];
    const by = arrayloc[1];

    ///SB LOCATION
    const sbx = 1054;
    const sby = 987;

    var xstep = bx - sbx;
    var ystep = by - sby;

    var xcor = Math.abs(xstep);
    var ycor = Math.abs(ystep);

    const x = Math.sign(xstep);
    const y = Math.sign(ystep);

    if (x === 0 && y === 1) {
      ///  DOOOOWN ONLY
      var bossfinal = "" + ycor + "D";
      return bossfinal;
    } else if (x === 0 && y === -1) {
      ///  UUUUPP ONLY
      var bossfinal = "" + ycor + "U";
      return bossfinal;
    } else if (x === 1 && y === 0) {
      ///   RIIIGHT ONLY
      var bossfinal = "" + xcor + "R";
      return bossfinal;
    } else if (x === -1 && y === 0) {
      ///  LEEEFFT ONLY
      var bossfinal = "" + xcor + "L";
      return bossfinal;
    } else if (x === 1 && y === 1) {
      ///  DOWN -- RIGHT
      var bossx = xcor + "R";
      var bossy = ycor + "D";
      var bossfinal = bossx + "" + bossy;
      return bossfinal;
    } else if (x === -1 && y === -1) {
      ///  LEFT -- UP
      var bossx = xcor + "L";
      var bossy = ycor + "U";
      var bossfinal = bossx + "" + bossy;
      return bossfinal;
    } else if (x === -1 && y === 1) {
      /// DOWN -- LEFT
      var bossx = ycor + "D";
      var bossy = xcor + "L";
      var bossfinal = bossx + "" + bossy;
      return bossfinal;
    } else {
      ///  RIGT -- UP
      var bossx = xcor + "R";
      var bossy = ycor + "U";
      var bossfinal = bossx + "" + bossy;
      return bossfinal;
    }
  }

  function getBoss(bdistanceobj, boss_locations) {
    var arrboss = [];

    const sortbydistnce = bdistanceobj.sort(function (a, b) {
      return a.boss_distance - b.boss_distance;
    });

    for (var b = 0; b < sortbydistnce.length; b++) {
      const boss_index = sortbydistnce[b]["boss_index"];
      var arrayloc = boss_locations[boss_index];
      var boss_coordinates = getCorBoss(arrayloc);

      var x = arrayloc[0];
      var y = arrayloc[1];
      // var pushthis = arrayloc+"="+boss_coordinates
      var pushthis =
        "[" +
        boss_coordinates +
        "](https://deadfrontier.info/map/Fairview_" +
        x +
        "x" +
        y +
        ".png)";
      arrboss.push(pushthis);
    }

    return arrboss;
  }

  function unixTime(time) {
    var date = new Date(time * 1000);
    // Hours part from the timestamp
    var hours = date.getHours();
    // Minutes part from the timestamp
    var minutes = "0" + date.getMinutes();
    // Seconds part from the timestamp
    var seconds = "0" + date.getSeconds();

    // Will display time in 10:30:23 format
    var formattedTime =
      hours + ":" + minutes.substr(-2) + ":" + seconds.substr(-2);

    return formattedTime;
  }

  //ASYNC FUNTIONS

  //GETCTS

  async function getCTS() {
    const data = await axios
      .get("https://www.dfprofiler.com/clan/weekly-ts")
      .then(function (res) {
        const dom = new JSDOM(res.data);
        const trs = dom.window.document.querySelectorAll("tr");

        var cts = [];
        for (var i = 1; i < 11; i++) {
          var obj = {};
          const childs = trs[i].children;

          const rank = childs[0].textContent;
          const name = childs[1].textContent;
          const score = childs[2].textContent;

          obj["rank"] = rank.replace(/^\s+|\s+$/g, "");
          obj["name"] = name.replace(/^\s+|\s+$/g, "");
          obj["score"] = score.replace(/^\s+|\s+$/g, "");
          cts.push(obj);
        }
        return cts;
      });
    return await data;
  }

  async function getkanaCTS() {
    const data = await axios
      .get("http://www.dfprofiler.com/clan/view/538")
      .then(function (res) {
        const dom = new JSDOM(res.data);
        const trs = dom.window.document.querySelectorAll("tr");

        var kanacts = [];
        for (var i = 1; i < trs.length; i++) {
          var obj = {};
          const childs = trs[i].children;

          const playername = childs[1].children[1].textContent;
          const level = childs[2].textContent;
          const wtsscore = childs[5].textContent;

          obj["name"] = playername.replace(/^\s+|\s+$/g, "");
          obj["level"] = level.replace(/^\s+|\s+$/g, "");
          obj["score"] = wtsscore.replace(/,/g, "");

          kanacts.push(obj);
        }
        return kanacts;
      }).catch(function (error) {
        // handle error
        console.log(error);
      });
    return await data;
  }


  async function getPlayerID(playername){

    var string1 = playername;
    var rep = string1.split(' ').join('_');
    const playername_link = rep;

    var string2 = playername;
    var replus = string2.split(' ').join('+');
    const playername_plus = replus;
    const response =  await fetch("https://www.dfprofiler.com/profile/autocomplete/"+playername_link+"", {
            "credentials": "include",
            "headers": {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0",
                "Accept": "application/json, text/javascript, */*; q=0.01",
                "Accept-Language": "en-US,en;q=0.5",
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "X-Requested-With": "XMLHttpRequest"
            },
            "referrer": "https://www.dfprofiler.com/",
            "body": "dataType=json&query="+playername_plus+"",
            "method": "POST",
            "mode": "cors"
        });

          const data = await response.json();
  
          if (!data.length){
            const result = 'No data';
            return result
          }else{
            const resultdata = data;
            return await resultdata
          }


  }

  async function getPrivateTrades(playerid){
    const response = await fetch("https://fairview.deadfrontier.com/onlinezombiemmo/trade_search.php", {
      "credentials": "include",
      "headers": {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0",
          "Accept": "*/*",
          "Accept-Language": "en-US,en;q=0.5",
          "Content-Type": "application/x-www-form-urlencoded",
          "X-Requested-With": "XMLHttpRequest",
          "Pragma": "no-cache",
          "Cache-Control": "no-cache"
      },
      "referrer": "https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=35",
      "body": "hash=4d6b4f4acef854ab13c392ef4941cf50&pagetime=1625997863&tradezone=&searchname=&search=trades&searchtype=private&memID="+playerid+"&category=&profession=",
      "method": "POST",
      "mode": "cors"
  });

  const data = await response.text();
  var privatedata = []
  let str = data;
  let obj = Object.fromEntries(new URLSearchParams(str));
  

  for (p=0; p<obj['tradelist2_maxresults'];p++){
          var raw = {}
          raw['private_to_mem_id'] = obj['tradelist2_'+p+'_id_member'];
          raw['private_to'] = obj['tradelist2_'+p+'_member_name'];
          raw['private_trade_id'] = obj['tradelist2_'+p+'_trade_id'];
          raw['private_item'] = obj['tradelist2_'+p+'_itemname'];;
          raw['private_price'] = obj['tradelist2_'+p+'_price'];
          raw['private_orgitem'] = obj['tradelist2_'+p+'_item']; 
          privatedata.push(raw)
  }
  // console.log(privatedata.length)

  if (privatedata.length < 0){
    var nodata = "No data";
    return nodata
  }else{
     return privatedata
  }

} 


async function getUrl(chart)
{
   const url = await chart.getShortUrl();
   return url;
}

});
client.login(process.env.token);


const watchjob = schedule.scheduleJob('*/59 * * * *', function(){

  const consql = mysql.createConnection({
    host: process.env.HOST_DB,  
    user: process.env.USER_DB,
    password: process.env.PASS_DB,
    database: process.env.DB_DB
  });

  consql.connect(function(err) {
    if (err) throw err;
    consql.query("SELECT items FROM watchlist;", function (err, result, fields) { 
      console.log(result.length)
      console.log(result)
      if(result.length > 0){
        result.forEach(row => {
          const items = row.items; ///NAME IN WATCH LIST
          getitems(items).then(data =>{
            // console.log(data);
          const item_name = data.itemname;
          const item_price = data.itemprice; 
          // console.log(item_name);   ///ITEM NAME
          // console.log(item_price);  ///ITEM PRICE

          const consql = mysql.createConnection({
            host: process.env.HOST_DB,  
            user: process.env.USER_DB,
            password: process.env.PASS_DB,
            database: process.env.DB_DB
            });
            consql.connect(function(err) {
            if (err) throw err;
              consql.query("INSERT INTO pricehistory3( itemname, itemprice) VALUES ( '"+item_name+"' , "+item_price+");", function (err, result, fields) {
               if (err) throw err;
                 console.log(result.affectedRows);
                 console.log(item_name+' Insert Succesfully');
           });
        });


           })

           });
         }
     });
  });
});


async function getitems(items){

  const response = await fetch("https://fairview.deadfrontier.com/onlinezombiemmo/trade_search.php", {
          "credentials": "include",
          "headers": {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:101.0) Gecko/20100101 Firefox/101.0",
              "Accept": "*/*",
              "Accept-Language": "en-US,en;q=0.5",
              "Content-Type": "application/x-www-form-urlencoded",
              "X-Requested-With": "XMLHttpRequest",
              "Sec-Fetch-Dest": "empty",
              "Sec-Fetch-Mode": "cors",
              "Sec-Fetch-Site": "same-origin"
          },
          "referrer": "https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=35",
          "body": "tradezone=4&searchname="+items+"&memID=&profession=&category=&search=trades&searchtype=buyinglistitemname",
          "method": "POST",
          "mode": "cors"
      });
          
          const data = await response.text();
          // var ret = data.split('tradelist_maxresults=');
          // const ret2 = ret[1];
          // var totals = ret2.split('&');
          // const totalitem = totals[0];
          // console.log(totalitem);   //prints: 123
          var privatedata = []
          let str = data;
          let obj = Object.fromEntries(new URLSearchParams(str));
          for (p=0; p<obj['tradelist_maxresults'];p++){
                  var raw = {}
                  raw['itemname'] = obj['tradelist_'+p+'_itemname'];
                  raw['itemprice'] = obj['tradelist_'+p+'_price'];
                  privatedata.push(raw)
          }
  
          const item = await privatedata[0]
          // console.log(item)
          return await item;
          // const item_name = item.itemname;
          // const item_price = item.itemprice; 
          // console.log(item_name);   ///ITEM NAME
          // console.log(item_price);  ///ITEM PRICE=====
  }
