const categories = require('../userCategory');

module.exports = {
	validate(client, message) {
		if (!message.member.hasPermission('MANAGE_GUILD')) {
			throw new Error('no_permission');
		}
	},
	async run(client) {
		// mandar em um channels especifico?sim

		// #1
		client.channels
			.get(process.env.RULES_CHAT)
			.send(
				'<:he4rt:629035176755724299> Sejam bem-vindos ao servidor He4rt Developers! [:flag_br:]\n\n``❗`` Nesta detalhada mensagem irá ser informado sobre tais artigos e cumprimentos a serem exercidos pelos usuários, impondo ordem, organização e respeito mútuo.\n``❗`` Para melhor organização do nosso discord, foi desenvolvido um sistema de apresentações em que poderá nos contar mais sobre você, suas linguagens e mais alguns detalhes. Apenas a partir do uso do comando ``!apresentar`` você terá acesso aos demais chats disponíveis em nosso discord.\n\n``$1`` - **Mensagens de caráter irritante, negativo, ou com o intuito de causar transtornos ou perturbar a ordem, não serão toleradas.**```objectivec\n\n• Flood/SPAM;\n• Excesso de CAPSLOCK;\n• Mensagens irritantes, repetitivas ou com a intenção de perturbar a ordem;\n• Sobrecarregar algum sistema.\n\n# Ocorrência (1º Ocorrência): Mudo por 8 horas;\n# Ocorrência (2º Ocorrência): Banimento de 2 dias;\n# Insistência (3º Ocorrênncia): Banimento permanente.```'
			);

		// #2
		setTimeout(() => {
			client.channels
				.get(process.env.RULES_CHAT)
				.send(
					'``$2`` - **Conteúdo pornográfico e obsceno.**```objectivec\n• Divulgação de sites ponográficos e/ou obscena.\n• Divulgação de mídia pornográfica e/ou obscena.\n\n# Ocorrência (1º Ocorrência): Banimento permanentemente.```'
				);
		}, 2000);

		// #3
		setTimeout(() => {
			client.channels
				.get(process.env.RULES_CHAT)
				.send(
					'``$3`` - **Estamos sempre abertos a novas comunidades de tecnologia, mas divulgações devem ser discutidas com o <@241070790383108096> para garantir um ambiente saudável em nosso discord sem ofender ou afetar membros diretamente**```objectivec\n•  Divulgações de outras comunidades são permitidas mediante contato com o @Pride; \n\n# Ocorrência (1º Ocorrência): Aviso e mensagem deletada;\n# Ocorrência (2º Ocorrência): Mudo por 8 horas;\n# Insistência (3º Ocorrência): Banimento permanentemente.```'
				);
		}, 2000);

		// #4
		setTimeout(() => {
			client.channels
				.get(process.env.RULES_CHAT)
				.send(
					'``$4`` - **Discursos de ódio.**```objectivec\n• Racismo\n• Bullying\n• Discriminação\n• Xenofobia\n• Difamação\n\n# Ocorrência (1º Ocorrência): Mudo por 8 horas;\n# Ocorrência (2° Ocorrência): Banimento permanentemente.```'
				);
		}, 3000);

		setTimeout(() => {
			client.channels
				.get(process.env.RULES_CHAT)
				.send(
					'``$5`` - **Divulgar links contendo.**```objectivec\n• Arquivos Maliciosos\n• Pirateados(Crackeados)\n• Links com referral\n• Links com encurtador (ad.fly, bit.ly e etc)\n\n# Ocorrência (1º Ocorrência): Mudo por 12 horas e aviso;\n# Ocorrência (2° Ocorrência): Banimento permanentemente.```'
				);
		}, 3000);

		setTimeout(() => {
			client.channels
				.get(process.env.RULES_CHAT)
				.send(
					'``$6`` - **Free-rank**```objectivec\n• Mensagens descontextualizados, totalmente inúteis, para promoção de rank no servidor.\n\n# Ocorrência (1º Ocorrência): Mudo por 3 horas;\n# Ocorrência (2º Ocorrência): Mudo por 9 horas e aviso de ban;\n# Insistência (3º Ocorrência): Banimento permanentemente.```'
				);
		}, 3000);

		setTimeout(() => {
			client.channels
				.get(process.env.RULES_CHAT)
				.send(
					'``$7`` - **Burlar sistemas**```objectivec\n• Qualquer tentativa de burlar uma punição será recompensada com um banimento imediato.\n\n# Ocorrência (1ª Ocorrência): Banimento permante.```'
				);
		}, 3000);
	},

	get command() {
		return {
			name: 'rules',
			category: categories.ADM,
			description: 'Irá enviar as regras',
			usage: 'rules',
		};
	},
};
