const { axios } = require('../');
const EventBase = require('./EventBase');
const { log, logTypes } = require('../util/log');

class GuildMemberRemove extends EventBase {
	constructor() {
		super('guildMemberRemove');
	}

	execute = async member => {
		try {
			await axios.delete(`/users/${member.user.id}`);
		} catch (e) {
			log(e.toString(), logTypes.ERROR);
		}
	};
}

module.exports = GuildMemberRemove;
