/**
 * Discord crypto info
 * 
 * Get the current details for your favorite currencies in Discord
 * 
 * @author Troy McCabe <troymccabe@gmail.com>
 */

const CoinMarketCap = require("node-coinmarketcap");
const Discord = require("discord.js");

var client = new Discord.Client();
client.on('ready', () => {});
client.on('message', msg => {
    var matches = msg.content.match(/[\$|\€|\¥|\£][a-z]{2,5}/igm);
    if (matches && matches.length) {
        for (var i = 0; i < matches.length; i++) {
            var currency = 'USD';
            var currencySymbol = matches[i].substr(0, 1);
            var symbol = matches[i].substr(1);
            switch(currencySymbol) {
                case '€':
                    currency = 'EUR';
                    break;

                case '¥':
                    currency = 'CNY';
                    break;

                case '£':
                    currency = 'GBP';
                    break;
            }
            (function(currency, currencySymbol, symbol) {
                var coinmarketcap = new CoinMarketCap({convert: currency});
                coinmarketcap.multi(coins => {
                    var coin = coins.get(symbol);
                    if (coin) {
                        var currencyLower = currency.toLowerCase();
                        msg.channel.send(
                            `__**#${coin.rank}: ${coin.name} (${coin.symbol})**__\n` +
                            `Price (${currency}): **${currencySymbol}${coin['price_' + currencyLower]}**\n` +
                            `Price (BTC): **${coin.price_btc}**\n` +
                            `24 Hour Volume (${currency}): **${currencySymbol}${coin['24h_volume_' + currencyLower]}**\n` +
                            `Market Cap (${currency}): **${currencySymbol}${coin['market_cap_' + currencyLower]}**\n` +
                            `% Change (1 Hour): **${coin.percent_change_1h}%**\n` +
                            `% Change (24 Hour): **${coin.percent_change_24h}%**\n` +
                            `% Change (7 Days): **${coin.percent_change_7d}%**`
                        ).catch(reason => {});
                    }
                });
            })(currency, currencySymbol, symbol);
        }
    }
});

client.login(process.env.DISCORD_TOKEN);