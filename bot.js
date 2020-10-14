require('dotenv').config();

const { Client, DiscordAPIError,Attachment } = require('discord.js');
const fs = require('fs');

const puppeteer = require('puppeteer-extra')

const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
puppeteer.use(AdblockerPlugin({ blockTrackers: true }))

const fetch = require('node-fetch');
const axios = require('axios');

const querystring = require('querystring');
const Discord = require('discord.js');
const client = new Client();
const PREFIX = "!";


client.on('ready', ()=>{
    console.log('You login Glenn');
});
client.on('message' , (message)=>{
    if (message.author.bot) return;
    if (message.content.startsWith(PREFIX)){
        const [CMD_NAME, ...args] = message.content
        .trim()
        .substring(PREFIX.length)
        .split(/\s+/);

        if (CMD_NAME === 'chsb'){
            if (args.length === 0) return message.reply('Give me an item name sier');
            var items = args.join(' ');
            var data1 = {
                tradezone: '13',
                category: '0',
                search: items
            }
            var sentdata = Object.keys(data1).map(key => key + '=' + data1[key]).join('&');
            var url = "http://meaty.dfprofiler.com/browsemarketplace.php?function=browseMarketWithCredits";
            
            axios({
                method: 'post',
                url: url,
                data: sentdata
            })
            .then(function (response) {
                var result = response.data;

               var resname1 = result[1].name;
               var resprice1 = result[1].price;
               var commaprice1 = thousands_separators(resprice1);
               var resseller1= result[1].sellerName;

               var resname2 = result[2].name;
               var resprice2 = result[2].price;
               var commaprice2 = thousands_separators(resprice2);
               var resseller2 = result[2].sellerName;

               var resname3 = result[3].name;
               var resprice3 = result[3].price;
               var commaprice3 = thousands_separators(resprice3);
               var resseller3 = result[3].sellerName;

               
                
                const exampleEmbed = new Discord.MessageEmbed()
                .setColor('#3c00ff')
                .setTitle('Market Checker Lowest Price 💳')
                
                .addFields(
                   
                    { name: '#1 Item Name', value: resname1, inline: true },
                    { name: 'Price',  value: commaprice1, inline: true },
                    { name: 'Seller', value: resseller1, inline: true },
                )
                .addFields(
                  
                    { name: '#2 Item Name', value: resname2, inline: true },
                    { name: 'Price', value: commaprice2, inline: true },
                    { name: 'Seller', value: resseller2, inline: true },
                )
                .addFields(
                   
                    { name: '#3 Item Name', value: resname3, inline: true },
                    { name: 'Price', value: commaprice3, inline: true },
                    { name: 'Seller', value: resseller3, inline: true },
                )
                .setTimestamp()
                .setFooter('Kannazuki Bot🤖');

                message.channel.send(exampleEmbed);



            })
            .catch(function (error) {
                message.channel.send('Item not found mister');
            });
          
        }else if (CMD_NAME === 'cts'){

            puppeteer.launch({args: ['--no-sandbox']}).then(async browser => {
                message.channel.send('Gathering Data From DFP....');
                const page = await browser.newPage()
                
                message.channel.send('May take 10sec');
                await page.goto('https://www.dfprofiler.com/clan/weekly-ts',{timeout: 0, waitUntil: 'networkidle0'})
                
                const result = await page.$$eval('#DataTables_Table_0 tr', rows => {
                  return Array.from(rows, row => {
                    const columns = row.querySelectorAll('td');
                    return Array.from(columns, column => column.innerText);
                  });
                });
                
                const exampleEmbed = new Discord.MessageEmbed()
                .setColor('#3c00ff')
                .setTitle('🔥Current Top 10 - Weekly CTS')
                
                .addFields(   
                    { name: '🥇 '+result[2][1], value: result[2][2]},
                )
                .addFields(                 
                    { name: '🥈 '+result[3][1], value: result[3][2]},      
                )
                .addFields(              
                    { name: '🥉 '+result[4][1], value: result[4][2]},            
                )
                .addFields(
                    { name: '#4 '+result[5][1], value: result[5][2]},                   
                )
                .addFields(   
                    { name: '#5 '+result[6][1], value: result[6][2]},             
                )
                .addFields(   
                    { name: '#6 '+result[7][1], value: result[7][2]},             
                )
                .addFields(   
                    { name: '#7 '+result[8][1], value: result[8][2]},             
                )
                .addFields(   
                    { name: '#8 '+result[9][1], value: result[9][2]},             
                )
                .addFields(   
                    { name: '#9 '+result[10][1], value: result[10][2]},             
                )
                .addFields(   
                    { name: '#10 '+result[11][1], value: result[11][2]},             
                )
                .setTimestamp()
                .setFooter('Kannazuki Bot🤖');

                message.channel.send(exampleEmbed);
  
                await browser.close()
                
              })
            
        }else if(CMD_NAME === 'help'){

            const exampleEmbed = new Discord.MessageEmbed()
            .setColor('#3c00ff')
            .setTitle('This Bot is for Kannazuki-DF')
            .addFields(     
                { name: 'List Available Commands:', value: '\u200B' },
            )
            .addFields(     
                { name: '!chsb', value: '-To check DF marketplace SB'},
            )
            .addFields(     
                { name: '!cts',  value: '-Show Top 5 weekly clan top survivor' },
            )
            .addFields(     
                { name: '!boss', value: '-Show current boss'},
            )
            .addFields(
                { name: '!chp13', value: '-To check DF marketplace P13'},
            )
            .addFields(
                { name: '!chsez', value: '-To check DF marketplace SEZ'},
            )
            .setTimestamp()
            .setFooter('Kannazuki Bot🤖-GlennRhee');

            message.channel.send(exampleEmbed);
            



               
        }else if (CMD_NAME === 'boss'){
            puppeteer.launch({args: ['--no-sandbox']}).then(async browser => {
                message.channel.send('```Gathering Boss Data...🔎```');
                const page = await browser.newPage()
                await page.setViewport({
                    width: 1003,
                    height: 933,
                    deviceScaleFactor: 1,
                  });
                await page.goto('https://www.dfprofiler.com/bossmap',{timeout: 0, waitUntil: 'networkidle0'})
                await page.waitForSelector('#bossmapframe');        
                const element = await page.$('#bossmapframe');
                fs.access('./boss-kana.png', (err) => {
                    if (err) {
                        console.log("boss-kana not exist.");
                    } else {
                        try {
                            fs.unlinkSync('./boss-kana.png')
                            console.log("Bot deleted the file and update it.")
                          } catch(err) {
                            throw err
                          }
                    }
                });
                await element.screenshot({path: 'boss-kana.png'});
                //// GET DATA FROM NODE_FETCH MAP
                (async () => {
                    const response = await fetch("https://bossmap2.dfprofiler.com/bosscode.php", {
                        "credentials": "include",
                        "headers": {
                            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:81.0) Gecko/20100101 Firefox/81.0",
                            "Accept": "*/*",
                            "Accept-Language": "en-US,en;q=0.5",
                            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                            "X-Requested-With": "XMLHttpRequest",
                            "Pragma": "no-cache",
                            "Cache-Control": "no-cache"
                        },
                        "referrer": "https://bossmap2.dfprofiler.com/bossmap.php?nocache=1602678363",
                        "body": "skey=RqXNvYAHgPELLrAGecnEvpqAgHGZxCbGskQiisHHCcuQYNUegHwYcyLpdEYDgbLK",
                        "method": "POST",
                        "mode": "cors"
                    });
                    const data = await response.json();
                    const exampleEmbed = new Discord.MessageEmbed()
                    exampleEmbed.setColor('#3c00ff')
                    exampleEmbed.setTitle('Boss Report!')
                    for(var i = 0; i < Object.keys(data).length; i++)
                                    {
                                        var key = ''+i;
                                        if(data[key] != null && data[key]["dfp_datatype"] != null)
                                        {
                                            switch(data[key]["dfp_datatype"])
                                            {
                
                                                case "boss":
                                                    {
                                                        var dhSpawn = false;
                                                        if(data[key]["dfp_bossnum"] == "1" && data[key]["special_enemy_type"] == "Devil Hound")
                                                        {
                                                            console.log(data[key]["dfp_bossnum"],data[key]["special_enemy_type"],data[key]["special_enemy_amount"]);
                                                            
                                                            dhSpawn = true;
                                                        } else {
                                                            
                                                                //  "+`${data[key]["dfp_bossnum"]}`+"
                                                                exampleEmbed.setTitle('🧟Current Cycle Boss🧟')
                                                                exampleEmbed.addFields(   
                                                                    { name:  '\u200B', value:  "```🧟["+`${data[key]["dfp_bossnum"]}`+"]"+`${data[key]["special_enemy_type"]}`+"```" },             
                                                                )
                                                          
                                                           
                                            
                                                           
                                                            
                                                        }
                                                        
                                                            break;
                                                    }
                                                case "oldboss":
                                                    {
                                                        exampleEmbed.setTitle('☠️Last Cycle Boss☠️')
                                                        exampleEmbed.addFields(   
                                                            { name:  '\u200B', value:  "```css\n☠️["+`${data[key]["dfp_bossnum"]}`+"]"+`${data[key]["special_enemy_type"]}`+"```" },             
                                                        )
                                                        
                                                        break;
                                                    }
                
                                            }
                                        }
                                    }
                                    
                                    exampleEmbed.attachFiles(['./boss-kana.png'])
                                    exampleEmbed.setImage('attachment://boss-kana.png');
                                    exampleEmbed.setTimestamp()
                                    exampleEmbed.setFooter('Kannazuki Bot🤖');
                                    message.channel.send(exampleEmbed);


                                    await browser.close()
                
                })();
                


                

                
                
              })
        }else if(CMD_NAME === 'chp13'){
            
            if (args.length === 0) return message.reply('Give me an item name sier');
            var items = args.join(' ');
            var data1 = {
                tradezone: '11', // Pres 13
                category: '0',
                search: items
            }
            var sentdata = Object.keys(data1).map(key => key + '=' + data1[key]).join('&');
            var url = "http://meaty.dfprofiler.com/browsemarketplace.php?function=browseMarketWithCredits";
            
            axios({
                method: 'post',
                url: url,
                data: sentdata
            })
            .then(function (response) {
                var result = response.data;

               var resname1 = result[1].name;
               var resprice1 = result[1].price;
               var commaprice1 = thousands_separators(resprice1);
               var resseller1= result[1].sellerName;

               var resname2 = result[2].name;
               var resprice2 = result[2].price;
               var commaprice2 = thousands_separators(resprice2);
               var resseller2 = result[2].sellerName;

               var resname3 = result[3].name;
               var resprice3 = result[3].price;
               var commaprice3 = thousands_separators(resprice3);
               var resseller3 = result[3].sellerName;

               
                
                const exampleEmbed = new Discord.MessageEmbed()
                .setColor('#3c00ff')
                .setTitle('Market Checker Lowest Price(P13) 💳')
                
                .addFields(
                   
                    { name: '#1 Item Name', value: resname1, inline: true },
                    { name: 'Price',  value: commaprice1, inline: true },
                    { name: 'Seller', value: resseller1, inline: true },
                )
                .addFields(
                  
                    { name: '#2 Item Name', value: resname2, inline: true },
                    { name: 'Price', value: commaprice2, inline: true },
                    { name: 'Seller', value: resseller2, inline: true },
                )
                .addFields(
                   
                    { name: '#3 Item Name', value: resname3, inline: true },
                    { name: 'Price', value: commaprice3, inline: true },
                    { name: 'Seller', value: resseller3, inline: true },
                )
                .setTimestamp()
                .setFooter('Kannazuki Bot🤖');

                message.channel.send(exampleEmbed);



            })
            .catch(function (error) {
                message.channel.send('Item not found mister');
            });


        }else if(CMD_NAME === 'chsez'){
            
            if (args.length === 0) return message.reply('Give me an item name sier');
            var items = args.join(' ');
            var data1 = {
                tradezone: '9', // Pres 13
                category: '0',
                search: items
            }
            var sentdata = Object.keys(data1).map(key => key + '=' + data1[key]).join('&');
            var url = "http://meaty.dfprofiler.com/browsemarketplace.php?function=browseMarketWithCredits";
            
            axios({
                method: 'post',
                url: url,
                data: sentdata
            })
            .then(function (response) {
                var result = response.data;

               var resname1 = result[1].name;
               var resprice1 = result[1].price;
               var commaprice1 = thousands_separators(resprice1);
               var resseller1= result[1].sellerName;

               var resname2 = result[2].name;
               var resprice2 = result[2].price;
               var commaprice2 = thousands_separators(resprice2);
               var resseller2 = result[2].sellerName;

               var resname3 = result[3].name;
               var resprice3 = result[3].price;
               var commaprice3 = thousands_separators(resprice3);
               var resseller3 = result[3].sellerName;

               
                
                const exampleEmbed = new Discord.MessageEmbed()
                .setColor('#3c00ff')
                .setTitle('Market Checker Lowest Price(SEZ)')
                
                .addFields(
                   
                    { name: '#1 Item Name', value: resname1, inline: true },
                    { name: 'Price',  value:  commaprice1, inline: true },
                    { name: 'Seller', value: resseller1, inline: true },
                )
                .addFields(
                  
                    { name: '#2 Item Name', value: resname2, inline: true },
                    { name: 'Price', value: commaprice2, inline: true },
                    { name: 'Seller', value: resseller2, inline: true },
                )
                .addFields(
                   
                    { name: '#3 Item Name', value: resname3, inline: true },
                    { name: 'Price', value: commaprice3, inline: true },
                    { name: 'Seller', value: resseller3, inline: true },
                )
                .setTimestamp()
                .setFooter('Kannazuki Bot🤖');

                message.channel.send(exampleEmbed);



            })
            .catch(function (error) {
                message.channel.send('Item not found mister');
            });


        }else{

            message.channel.send('Invalid Command Sier');
        }


        
    }
    function thousands_separators(num)
  {
    var num_parts = num.toString().split(".");
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return num_parts.join(".");
  }


});

client.login(process.env.token);
