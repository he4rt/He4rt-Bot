const Discord = require('discord.js');
// const Canvas = require('canvas');
const snekfetch = require('snekfetch');
// const { registerFont } = require('canvas');

module.exports = async (client, member) => {
	// registerFont('assets/Montserrat-SemiBold.ttf', { family: 'Montserrat' });
	// const addText = (canvas, text) => {
	// 	const ctx = canvas.getContext('2d');
	// 	let fontSize = 90;
	// 	do {
	// 		ctx.font = `${(fontSize -= 10)}px Montserrat`;
	// 	} while (ctx.measureText(text).width > canvas.width - 300);
	// 	return ctx.font;
	// };
	// const canvas = Canvas.createCanvas(512, 250);
	// const ctx = canvas.getContext('2d');
	// const wallpaper = await Canvas.loadImage('./wallpaper.png');

	// ctx.drawImage(wallpaper, 0, 0, canvas.width, canvas.height);

	// ctx.font = '30px Montserrat';
	// ctx.fillStyle = '#ffffff';
	// ctx.fillText(`${member.displayName}`, 188, 120);

	// ctx.beginPath();
	// ctx.arc(103, 118, 77, 0, Math.PI * 2, true);
	// ctx.closePath();
	// ctx.clip();

	// // TODO use node-fetch
	// const { body: buffer } = await snekfetch.get(member.user.displayAvatarURL);
	// const avatar = await Canvas.loadImage(buffer);
	// ctx.drawImage(avatar, 25, 25, 170, 170);

	// const attachment = new Discord.Attachment(
	// 	canvas.toBuffer(),
	// 	'welcome-user.png'
	// );

	member.addRole(member.guild.roles.find('id', process.env.MEMBER_ROLE));
	console.log(member.user);
	client.axios
		.post(`/users?discord_id=${member.user.id}`)
		.catch(err => console.log(err));

	// Mandar DM pra pessoa que entrou

	member.send(
		':flag_br: Bem-vindo a He4rt, \n\n ▫ Leia o canal <#540992412793700382>;\n ▫ Descumprir as regras resultará em punições;\n ▫ Utilize ``!apresentar`` para facilitar a comunicação.\n\n``💡`` Não tenha medo de pedir ajuda, estamos aqui para ajudar e aprender.' +
			'\n\n' +
			":flag_us: Welcome to He4rt, \n\n ▫ Read the <#540992412793700382> channel;\n ▫ Breaking the rules will result in punishments;\n ▫ Use ``!apresentar`` to introduce and facilitate the communication.\n\n``💡`` Don't be afraid to ask for help, we're here to help and learn."
	);

	client.channels
		.get(process.env.WELCOME_CHAT)
		.send(`<:he4rt:546395281093034015> | ${member}`);
	client.channels
		.get(process.env.RULES_CHAT)
		.send(`<:he4rt:546395281093034015> | ${member}`)
		.then(msg => msg.delete(8000));
};
