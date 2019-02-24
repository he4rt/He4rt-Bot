const Discord = require('discord.js');
const Canvas = require('canvas');
const snekfetch = require('snekfetch');
const Twit = require('twit');
const request = require('request');


/* var T = new Twit({
    consumer_key:         process.env.TWITTER_CONSUMER_KEY,
    consumer_secret:      process.env.TWITTER_CONSUMER_SECRET,
    access_token:         process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret:  process.env.TWITTER_ACCESS_TOKEN_SECRET,
    timeout_ms:           60*1000,
    strictSSL:            true,
})*/


const host = process.env.END_POINT_CREATE;

module.exports = {
    run: (client, message, args) => {

      if (!message.member.hasPermission('MANAGE_GUILD')) {
        return message.channel.send(
          '``❌`` Você não possui permissão para utilizar este comando. ``[MANAGE_GUILD]``'
        );
      }

var Day = new Date().toISOString().split("T")[0];
var id_users = []
request(`${host}${Day}`, (err, res, body) => {
    var info = JSON.parse(body);
    info['data'].forEach(element => {
        id_users.push(element['discord_id'])
    });
            var name;
            id_users.forEach(element => {
               name = client.guilds.get(process.env.GUILD_ID).members.get(element)
               T.post('statuses/update', { status: `Bem vindo ${name}` }, function(err, data, response) {})
            });
            })
        },

        get command() {
            return {
              name: 'twitter',
              category: 'Moderator',
              description: 'Divulgação de novos usuarios no twitter.',
              usage: 'twitter'
            }
        }
    }
