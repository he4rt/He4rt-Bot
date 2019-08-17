const jimp = require('jimp');

const { client, axios } = require('../');
const EventBase = require('./EventBase');

const maskPath = require.resolve('../assets/mask.png');
const welcome1 = require.resolve('../assets/welcome-1.jpg');
const welcome2 = require.resolve('../assets/welcome-2.jpg');
const welcome3 = require.resolve('../assets/welcome-3.jpg');

const { log, logTypes } = require('../util/log');

class GuildMemberAdd extends EventBase {
	constructor() {
		super('guildMemberAdd');
	}

	execute = async member => {
		const backgroundSelect = [welcome1, welcome2, welcome3];

		const font = await jimp.loadFont(jimp.FONT_SANS_32_WHITE);
		const mask = await jimp.read(maskPath);
		const background = await jimp.read(
			backgroundSelect[Math.floor(Math.random() * 3)],
		);
		const avatar = await jimp.read(member.user.avatarURL);

		avatar.resize(77, 77);
		mask.resize(77, 77);
		avatar.mask(mask);
		background.composite(avatar, 210, 97);
		background.print(
			font,
			250,
			150,
			{
				text: `${member.user.username}`,
				alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
				alignmentY: jimp.VERTICAL_ALIGN_MIDDLE,
			},
			1,
		);
		background.write('welcome.png');

		const welcomeMessage =
			':flag_br: Bem-vindo a He4rt, \n\n ▫ Leia o canal <#540992412793700382>;\n ▫ Descumprir as regras resultará em punições;\n ▫ Utilize ``!apresentar`` para facilitar a comunicação.\n\n``💡`` Não tenha medo de pedir ajuda, estamos aqui para ajudar e aprender.' +
			'\n\n' +
			":flag_us:	 Welcome to He4rt, \n\n ▫ Read the <#540992412793700382> channel;\n ▫ Breaking the rules will result in punishments;\n ▫ Use ``!apresentar`` to introduce and facilitate the communication.\n\n``💡`` Don't be afraid to ask for help, we're here to help and learn.";

		try {
			await axios.post(`/users`, {
				discord_id: member.id,
			});
		} catch (e) {
			log(e, logTypes.ERROR);
		}

		member.send(welcomeMessage);
		client.channels
			.get(process.env.WELCOME_CHAT)
			.send(`<:he4rt:546395281093034015> | ${member}`, {
				files: ['welcome.png'],
			});
	};
}

module.exports = GuildMemberAdd;
