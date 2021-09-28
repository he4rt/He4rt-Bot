const { getYear } = require('../../');
const { typesEnum } = require('./enums');

const YEAR = getYear();

const createEmbedResponse = ({ author, collectors, messageGenerator }) =>
	messageGenerator
		.setTitle(`**Apresentação** » ${author.username}`)
		.setThumbnail(author.avatarURL)
		.setColor('#8146DC')
		.addField(
			'**Sobre:**',
			collectors[typesEnum.ABOUT].collected.first().content
		)
		.addField(
			'**Nome:**',
			collectors[typesEnum.NAME].collected.first().content
		)
		.addField(
			'**GitHub:**',
			collectors[typesEnum.GITHUB].collected.first().content,
			true
		)
		.addField(
			'**LinkedIn:**',
			collectors[typesEnum.LINKEDIN].collected.first().content,
			true
		)
		.addField(
			'**Áreas de atuação que já trabalhou e/ou tem interesse:**',
			collectors[typesEnum.ROLE]
		)
		.addField('**Vaga que possui interesse:**', collectors[typesEnum.JOB])
		.addField(
			'**Linguagens que conhece:**',
			collectors[typesEnum.LANGUAGES]
		)
		.addField('**Tempo de experiência:**', collectors[typesEnum.EXPERIENCE])
		.addField(
			'**Está trabalhando atualmente:**',
			collectors[typesEnum.IS_EMPLOYED]
		)
		.setFooter(
			`${YEAR} © He4rt Developers e Juntos Somos Mais`,
			'https://i.imgur.com/14yqEKn.png'
		)
		.setTimestamp();

module.exports = {
	createEmbedResponse,
};
