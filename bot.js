require('dotenv').config();

const { Client, DiscordAPIError } = require('discord.js');
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
          
        }else{
            message.channel.send('invalid Command sier');
        }

        
    }
    function thousands_separators(num)
  {
    var num_parts = num.toString().split(".");
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return num_parts.join(".");
  }


});

client.login(process.env.DISCORD_TOKEN);
