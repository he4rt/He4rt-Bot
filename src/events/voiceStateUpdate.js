// Armazena em memória o usuário e o canal de corworking dele
const userChannelRelation = {};

module.exports = async (client, oldMember, newMember) => {
	const newUserChannel = newMember.voiceChannel;
	const oldUserChannel = oldMember.voiceChannel;

	// Caso especifico: se o usuario saiu do coworking dele e foi direto pra sala que cria o coworking
	if (
		oldUserChannel &&
		oldUserChannel.id === userChannelRelation[oldMember.user.id] &&
		newUserChannel &&
		newUserChannel.id === process.env.COWORKING_VOICE_ID
	) {
		return newMember.setVoiceChannel(
			userChannelRelation[newMember.user.id]
		);
	}

	// Se o usuário saiu do canal de coworking dele
	if (
		oldUserChannel &&
		oldUserChannel.id === userChannelRelation[oldMember.user.id]
	) {
		delete userChannelRelation[oldMember.user.id];
		return oldUserChannel.delete();
	}

	if (
		!newUserChannel ||
		newUserChannel.id !== process.env.COWORKING_VOICE_ID
	) {
		return;
	}

	const channelName = `Sala de ${newMember.user.username}`;
	const alreadyHaveChannel = !!userChannelRelation[newMember.user.id];
	if (alreadyHaveChannel) return;

	const createdChan = await client.guilds
		.get(process.env.GUILD_ID)
		.createChannel(channelName, 'voice');

	await createdChan.setParent(process.env.COWORKING_CATEGORY_ID);
	newMember.setVoiceChannel(createdChan);
	userChannelRelation[newMember.user.id] = createdChan.id;
};
