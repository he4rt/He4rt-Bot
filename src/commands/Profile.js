const jimp = require('jimp');
const CommandBase = require('./CommandBase');
const { axios, jimpLoads } = require('../index');
const { log, logTypes } = require('../util/log');

class Profile extends CommandBase {
	constructor() {
		super('profile', [], 'Ver o perfil de um usuário.');
	}

	execute = async ({ author, member, channel }) => {
		try {
			const { data } = await axios.get(`/users/${author.id}`);

			if (!data) {
				throw new Error(`Failed to get data for ${author.id}`);
			}

			const { images, fonts, langImages, emblemImages } = jimpLoads;

			const langs = langImages.filter(({ id }) => member.roles.get(id));
			const emblems = emblemImages.filter(({ id }) => member.roles.get(id));

			const avatar = await jimp.read(author.avatarURL);
			const mask = images.find(x => x.name === 'maskHex.png').res.clone();
			const background = images.find(x => x.name === 'profileBase.png').res.clone();
			const fontDefault = fonts.find(x => x.name === 'Pixellari-22px.fnt').res;
			const fontYellow = fonts.find(x => x.name === 'Pixellari-yellow-22px.fnt').res;

			mask.resize(129, 131);
			avatar.resize(129, 131);
			avatar.mask(mask);
			background.composite(avatar, 13, 20);

			// Nick
			background.print(fontDefault, 209, 26, author.username.replace(/[^A-Za-z\d]+/, ''), 1);

			// Nivel
			background.print(fontDefault, 214, 60, data.level || 0, 1);

			// HCoins
			background.print(fontYellow, 230, 93, `$${data.money || '00.00'}`, 1);

			// Sobre
			background.print(fontDefault, 349, 70, (data.about || '').substring(0, 220), 300);

			// Languages
			if (langs.length >= 1) {
				for (let i = 0; i < langs.length; i++) {
					const img = langs[i].res;
					img.resize(35, 35);

					background.composite(img, 15 + 40 * i, 310);
				}
			}

			// Emblems
			if (emblems.length >= 1) {
				for (let j = 0; j < emblems.length; j++) {
					const img = emblems[j].res;
					img.resize(45, 45);

					background.composite(img, 65 + 55 * j, 221);
				}
			}

			const image = await background.getBufferAsync(jimp.MIME_PNG);
			channel.send({
				files: [
					{
						attachment: image,
						name: 'profile.png',
					},
				],
			});
		} catch (err) {
			log(`Error when executing profile command: ${err.toString()}`, logTypes.ERROR);
		}
	};
}

module.exports = Profile;
