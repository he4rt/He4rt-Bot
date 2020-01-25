const { HORIZONTAL_ALIGN_CENTER, VERTICAL_ALIGN_MIDDLE, MIME_PNG, read } = require('jimp');
const { client, jimpLoads, axios } = require('../index');
const EventBase = require('./EventBase');

const { log, logTypes } = require('../util/log');

class GuildMemberAdd extends EventBase {
	constructor() {
		super('guildMemberAdd');
	}

	execute = async ({ user, send }) => {
		const { images, fonts } = jimpLoads;

		const backgroundSelect = images.filter(x => x.name.includes('welcome'));

		const font = fonts.find(x => x.name === 'Pixellari-22px.fnt').res;
		const mask = images.find(x => x.name === 'mask.png').res.clone();
		const background = backgroundSelect[Math.floor(Math.random() * 3)];
		const avatar = await read(user.avatarURL);

		avatar.resize(77, 77);
		mask.resize(77, 77);

		avatar.mask(mask);
		background.composite(avatar, 210, 97);

		background.print(
			font,
			250,
			150,
			{ text: `${user.username}`, alignmentX: HORIZONTAL_ALIGN_CENTER, alignmentY: VERTICAL_ALIGN_MIDDLE },
			1,
		);

		const image = await background.getBufferAsync(MIME_PNG);

		const welcomeMessage =
			':flag_br: Bem-vindo a He4rt, \n\n ▫ Leia o canal <#540992412793700382>;\n ' +
			'▫ Descumprir as regras resultará em punições;\n ' +
			'▫ Utilize ``!apresentar`` para facilitar a comunicação.\n\n``💡`` ' +
			'Não tenha medo de pedir ajuda, estamos aqui para ajudar e aprender.' +
			'\n\n' +
			':flag_us:	 Welcome to He4rt, \n\n ▫ Read the <#540992412793700382> channel;\n ' +
			'▫ Breaking the rules will result in punishments;\n ' +
			'▫ Use ``!apresentar`` to introduce and facilitate the communication.\n\n``💡`` ' +
			"Don't be afraid to ask for help, we're here to help and learn.";

		try {
			await axios.post(`/users`, { discord_id: user.id });
		} catch (e) {
			log(e, logTypes.ERROR);
		}

		send(welcomeMessage);
		const channel = client.channels.get(process.env.WELCOME_CHAT);

		channel.send(`<:he4rt:546395281093034015> | 'member'`, {
			files: [
				{
					attachment: image,
					name: 'welcome.png',
				},
			],
		});
	};
}

module.exports = GuildMemberAdd;
