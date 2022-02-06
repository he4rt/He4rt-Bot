const fs = require('fs');
const path = require('path');

const scamLinks = fs
	.readFileSync(path.resolve(__dirname, 'scam_links.txt'))
	.toString('utf8')
	.split('\n')
	.filter(link => link !== '');

// Returns true if `message` contains a blacklisted link.
const containsScamLink = message => {
	for (let i = 0; i < scamLinks.length; i += 1) {
		if (message.includes(scamLinks[i])) {
			console.info(`message contains scam link: ${scamLinks[i]}`);
			return true;
		}
	}

	return false;
};

module.exports = {
	containsScamLink,
};
