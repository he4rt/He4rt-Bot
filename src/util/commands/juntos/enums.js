const typesEnum = {
	NAME: 'name',
	GITHUB: 'github',
	LINKEDIN: 'linkedin',
	ROLE: 'role',
	LANGUAGES: 'languages',
	JOB: 'job',
	EXPERIENCE: 'experience',
	ABOUT: 'about',
};

const typesToRoles = {
	[typesEnum.ROLE]: 'tech_roles',
	[typesEnum.LANGUAGES]: 'dev_roles',
	[typesEnum.JOB]: 'jobs_roles',
	[typesEnum.EXPERIENCE]: 'experience_roles',
};

module.exports = {
	typesEnum,
	typesToRoles,
};
