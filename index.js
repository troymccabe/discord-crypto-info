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
    var matches = msg.content.toLowerCase().match(/[\$|\€|\¥|\£][a-z]{2,5}/igm);
    if (matches && matches.length) {
        matches = [...new Set(matches)];
        for (var i = 0; i < matches.length; i++) {
            var currency;
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

                case '$':
                default:
                    currency = 'USD';
            }
            (function(currency, currencySymbol, symbol) {
                var coinmarketcap = new CoinMarketCap({convert: currency});
                coinmarketcap.multi(coins => {
                    var coin = coins.get(symbol);
                    if (coin) {
                        var currencyLower = currency.toLowerCase();
                        msg.channel.send(
                            `__**#${coin.rank}: ${coin.name} (${coin.symbol})**__\n` +
                            `Price (${currency}): **${currencySymbol}${new Number(coin['price_' + currencyLower]).toLocaleString()}**\n` +
                            `Price (BTC): **${coin.price_btc}**\n` +
                            `24 Hour Volume (${currency}): **${currencySymbol}${new Number(coin['24h_volume_' + currencyLower]).toLocaleString()}**\n` +
                            `Market Cap (${currency}): **${currencySymbol}${new Number(coin['market_cap_' + currencyLower]).toLocaleString()}**\n` +
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