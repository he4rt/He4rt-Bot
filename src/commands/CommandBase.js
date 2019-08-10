const { log, logTypes } = require('../util/log');

class CommandBase {
	constructor(name, allowedRoles, description) {
		this.name = name;
		this.allowedRoles = allowedRoles;
		this.description = description;
	}

	help = () => {
		const { name, allowedRoles, description } = this;
		return {
			name,
			allowedRoles,
			description,
		};
	};

	checkRoles = user => {
		if (!this.allowedRoles || this.allowedRoles.length < 1) {
			return true;
		}

		if (!user || !user.roles) {
			log(
				`Command '${this.name}' role check: User roles not found`,
				logTypes.ERROR,
			);
			return false;
		}

		const matchingRoles = this.allowedRoles.map(x => user.roles.has(x));
		return matchingRoles === this.allowedRoles;
	};
}

module.exports = CommandBase;
