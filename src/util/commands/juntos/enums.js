const typesEnum = {
	NAME: 'name',
	GITHUB: 'github',
	LINKEDIN: 'linkedin',
	EMAIL: 'email',
	ROLE: 'role',
	LANGUAGES: 'languages',
	JOB: 'job',
	EXPERIENCE: 'experience',
	IS_EMPLOYED: 'is_employed',
	ABOUT: 'about',
};

const typesToRoles = {
	[typesEnum.ROLE]: 'tech_roles',
	[typesEnum.LANGUAGES]: 'dev_roles',
	[typesEnum.JOB]: 'jobs_roles',
	[typesEnum.EXPERIENCE]: 'experience_roles',
	[typesEnum.IS_EMPLOYED]: 'is_employed',
};

module.exports = {
	typesEnum,
	typesToRoles,
};
