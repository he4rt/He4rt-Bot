const { promisify } = require('util');
const Discord = require('discord.js');
const util = require('../util');
const categories = require('../userCategory');

const TIMEOUT = 60 * 1000;

const createEmbeds = () => {

	const username = new Discord.RichEmbed()
		.setTitle(`**Qual seu usuário da Twitch?**`)
		.setDescription(`:warning: **Você precisa está seguindo https://www.twitch.tv/He4rtDevs antes de enviar o seu nick.***`)
        .setColor('#36393E');

    const code = new Discord.RichEmbed()
		.setTitle(`**Enviamos um código para seu usuário da Twitch.**`)
		.setDescription('Aguardando digitar o código...')
		.setColor('#36393E');
	return { username, code };
};

const isAuthor = (message, author) => message.author.id === author.id;
const collect = promisify((collector, cb) => {
	collector.on('end', (collected, reason) => {
		const collectedArray = collected.array();
		if (collectedArray.length) {
			cb(null, collectedArray);
		} else {
			cb(new Error(reason));
		}
	});
});
const collectMessage = message => {
	const collector = message.author.dmChannel.createMessageCollector(
		({ author }) => isAuthor(message, author),
		{ time: TIMEOUT }
	);
	collector.on('collect', msg => {
		if (!util.isCommand(msg)) {
			collector.stop();
		}
	});
	return collect(collector).then(() => collector);
};

const cooldown = {};
module.exports = {
	run: async (client, message) => {
		let id = Math.floor(Math.random() * 900000) + 100000;
		if (cooldown[message.author.id]) {
			throw new Error('cooldown');
		}
		cooldown[message.author.id] = true;

		const embeds = createEmbeds();
		const collectors = {};
		client.axios.get(`/users/${message.author.id}`).then(res => console.log(res.data))
        try {
			const res = await client.axios.get(`/users/${message.author.id}`)
            if(res.data.twitch) {
                return message.author.send(':x: Usuário já vinculado.');
            }
        } catch (e) {
            console.log(e)
            return message.author.send(':x: Ocorreu um problema ao vincular.');
        }

		await message.author.send(embeds.username);
		collectors.username = await collectMessage(message);

		await message.author.send(embeds.code);
		collectors.code = await collectMessage(message);

		if(collectors.code.collected.first().content == id) {
			const sucess = new Discord.RichEmbed()
			.setTitle('**Parabéns, seus dados fornecidos foram vinculados com sucesso a nossa plataforma do Discord.**')
			.setColor('#36393E')
			await client.axios.put(
			  `/users/${message.author.id}`,{
				twitch: collectors.username.collected.first().content
				
			  }).then( res => {
				cooldown[message.author.id] = false;
				return message.author.send(sucess);
			  }).catch(error => { 
				console.log(error)
				return message.author.send('**❌ | Erro inesperado, tente novamente utilizando ``!twitch``.**');;
			  })
		  } else {
			const error = new Discord.RichEmbed()
			  .setTitle('**Código incorreto, tente novamente utilizando ``!twitch``.**')
			  .setColor('#36393E')
			return message.author.send(error)
		  }
        
	},
	async fail(err, client, message) {
		if (err.message === 'cooldown') {
			const cooldownEmbed = new Discord.RichEmbed()
				.setTitle(
					'``❌`` **Você já utilizou este comando, verifique sua DM para mais informações.**'
				)
				.setColor('#36393E');
			return message.channel.send(cooldownEmbed);
		}
		cooldown[message.author.id] = false;

		// geralmente quando user ta com dm desativada
		if (err.message === 'Cannot send messages to this user') {
			const dmDisabled = new Discord.RichEmbed()
				.setTitle(
					'``❌`` **Ops, seu privado está desativado e não consigo enviar algumas informações.**'
				)
				.setColor('#36393E');
			return message.channel.send(dmDisabled);
		}
		if (err.message === 'registered') {
			return message.channel
				.send('``❌`` Usuário da twitch já sincronizado.')
				.then(msg => msg.delete(8000));
		}
		if (err.message === 'time') {
			const timeout = new Discord.RichEmbed()
				.setTitle('``❌`` **Tempo limite de resposta excedido.**')
				.setDescription(
					'Utilize `!twitch` para terminar de vincular.'
				)
				.setColor('#36393E');
			return message.author.send(timeout);
		}
		return null;
	},
	get command() {
		return {
			name: 'twitch',
			category: categories.USER,
			description: 'O usuario irá vincular a conta da twitch.',
			usage: 'twitch',
		};
	},
};
