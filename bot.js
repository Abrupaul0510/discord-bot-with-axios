require('dotenv').config();

const { Client, DiscordAPIError } = require('discord.js');

const puppeteer = require('puppeteer-extra')

const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
puppeteer.use(AdblockerPlugin({ blockTrackers: true }))

const axios = require('axios');
const querystring = require('querystring');
const Discord = require('discord.js');
const client = new Client();
const PREFIX = "!";

client.on('ready', ()=>{
    console.log('You login');
});
client.on('message' , (message)=>{
    if (message.author.bot) return;
    if (message.content.startsWith(PREFIX)){
        const [CMD_NAME, ...args] = message.content
        .trim()
        .substring(PREFIX.length)
        .split(/\s+/);

        if (CMD_NAME === 'check'){
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
                .setTitle('Test Market Checker Lowest Price')
                
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
                .setFooter('Test Bot');

                message.channel.send(exampleEmbed);



            })
            .catch(function (error) {
                message.channel.send('Item not found mister');
            });
          
        }else if (CMD_NAME === 'cts'){

            puppeteer.launch({ headless: true }).then(async browser => {
                message.channel.send('Gathering Data From DFP....');
                const page = await browser.newPage()
                
                message.channel.send('May take 10sec');
                await page.goto('https://www.dfprofiler.com/clan/weekly-ts',{timeout: 0, waitUntil: 'networkidle0'})
                message.channel.send('Almost there....');
                const result = await page.$$eval('#DataTables_Table_0 tr', rows => {
                  return Array.from(rows, row => {
                    const columns = row.querySelectorAll('td');
                    return Array.from(columns, column => column.innerText);
                  });
                });
                message.channel.send('Gotcha...!');
                const exampleEmbed = new Discord.MessageEmbed()
                .setColor('#3c00ff')
                .setTitle('Top 5 - Weekly Clan Top Survivors')
                
                .addFields(   
                    { name: result[2][1], value: result[2][2]},
                )
                .addFields(                 
                    { name: result[3][1], value: result[3][2]},      
                )
                .addFields(              
                    { name: result[4][1], value: result[4][2]},            
                )
                .addFields(
                    { name: result[5][1], value: result[5][2]},                   
                )
                .addFields(   
                    { name: result[6][1], value: result[6][2]},             
                )
                .setTimestamp()
                .setFooter('Test-Bot-Cmd2-Kana');

                message.channel.send(exampleEmbed);
  
                await browser.close()
                
              })
            
        }else{
            message.channel.send('Invalid command sier');    
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
