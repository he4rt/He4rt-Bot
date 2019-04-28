const Twit = require('twit');
const axios = require('axios');
const categories = require('../userCategory');

// TODO: isso ta hard coded
const T = new Twit({
	consumer_key: process.env.TWITTER_CONSUMER_KEY,
	consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
	access_token: process.env.TWITTER_ACCESS_TOKEN,
	access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
	timeout_ms: 60 * 1000,
	strictSSL: true,
});

const host = process.env.END_POINT_CREATE;

module.exports = {
	validate(client, message) {
		if (!message.member.hasPermission('MANAGE_GUILD')) {
			throw new Error('no_permission');
		}
	},
	async run(client) {
		const Day = new Date().toISOString().split('T')[0];
		const { data: info } = await axios.get(`${host}${Day}`);
		const idUsers = info.data.map(element => element.discord_id);
		const promises = idUsers.map(userId => {
			const name = client.guilds
				.get(process.env.GUILD_ID)
				.members.get(userId);
			return T.post('statuses/update', { status: `Bem vindo ${name}` });
		});
		return Promise.all(promises);
	},

	get command() {
		return {
			name: 'twitter',
			category: categories.MOD,
			description: 'Divulgação de novos usuarios no twitter.',
			usage: 'twitter',
		};
	},
};
