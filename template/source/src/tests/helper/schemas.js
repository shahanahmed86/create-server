export const adminSchema = {
	shouldHave: {
		id: 'string',
		username: 'string',
		role: 'string',
		createdAt: 'date',
		updatedAt: 'date',
	},
	shouldNotHave: ['password', 'isDeleted'],
};

export const userSchema = {
	shouldHave: {
		id: 'string',
		username: 'string',
		avatar: 'string',
		fullName: 'string',
		email: 'string',
		cell: 'string',
		gender: 'string',
		signUpType: 'string',
		createdAt: 'date',
		updatedAt: 'date',
	},
	shouldNotHave: ['password', 'isDeleted'],
};
