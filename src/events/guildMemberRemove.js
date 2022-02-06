const Discord = require('discord.js');

module.exports = async (client, member) => {
	client.axios
		.delete(`/users/${member.user.id}`)
		.catch(err => console.log(err.response));
};
