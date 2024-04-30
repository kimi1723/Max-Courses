exports.getPosts = (req, res, next) => {
	res.status(200).json({
		posts: [{ title: 'First post', content: 'This is the first post' }],
	});
};

exports.postPost = (req, res, next) => {
	const { title, content } = req.body;

	res.status(201).json({
		message: 'Post created successfuly!',
		post: {
			id: new Date().toISOString(),
			title,
			content,
		},
	});
};

exports.getOpenAi = (req, res, next) => {
	res.status(200).json({
		choices: [
			{
				finish_reason: 'stop',
				index: 0,
				message: {
					content: 'The 2020 World Series was played in Texas at Globe Life Field in Arlington.',
					role: 'assistant',
				},
				logprobs: null,
			},
		],
		created: 1677664795,
		id: 'chatcmpl-7QyqpwdfhqwajicIEznoc6Q47XAyW',
		model: 'gpt-3.5-turbo-0613',
		object: 'chat.completion',
		usage: {
			completion_tokens: 17,
			prompt_tokens: 57,
			total_tokens: 74,
		},
	});
};
