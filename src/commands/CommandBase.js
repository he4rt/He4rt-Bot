const { log, logTypes } = require('../util/log');

/**
 * @typedef { Object } HelpObject
 * @property { string } name Command Name
 * @property { string[] } allowedRoles Roles allowed to use the command
 * @property { string } description Command description
 */

class CommandBase {
	/**
	 * @param { string } name Command Name
	 * @param { string[] } allowedRoles Roles allowed to use the command
	 * @param { string } description Command description
	 */
	constructor(name, allowedRoles, description) {
		this.name = name;
		this.allowedRoles = allowedRoles;
		this.description = description;
	}

	/**
	 * Get the help object for the command
	 * @return {HelpObject}
	 */
	help = () => {
		const { name, allowedRoles, description } = this;
		return {
			name,
			allowedRoles,
			description,
		};
	};

	/**
	 * Function to check if the user has the roles to use the command
	 * @param { GuildMember } user
	 * @param { string[] } [allowedRoles=this.allowedRoles]
	 * @return { boolean }
	 */
	checkRoles = (user, allowedRoles = this.allowedRoles) => {
		if (!allowedRoles || allowedRoles.length < 1) {
			return true;
		}

		if (!user || !user.roles) {
			log(
				`Command '${this.name}' role check: User roles not found`,
				logTypes.ERROR,
			);
			return false;
		}

		const matchingRoles = allowedRoles.map(x => user.roles.has(x));
		return matchingRoles.every(x => x === true);
	};
}

module.exports = CommandBase;
