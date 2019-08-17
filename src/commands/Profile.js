const CommandBase = require('./CommandBase');

const jimp = require('jimp');

class Profile extends CommandBase {
	constructor() {
		super('profile', [], 'Ver o perfil de um usuário.');
	}

	execute = async message => {
		const { data } = await axios.get('/users', {
			discord_id: message.author.id
		});

		const printText = () => {

		};

		const background = await jimp.read('https://i.imgur.com/EHBGtnb.png');
		const mask = await jimp.read('https://i.imgur.com/Szhk3pY.png');
		const avatar = await jimp.read(message.author.avatarURL);

		avatar.resize(140, 120);
		avatar.mask(mask);
		background.composite(avatar, 77, 84);

		background.write('welcome.png');

		console.log(data);
		await message.channel.send('Olá.');
	};
}

module.exports = Profile;
