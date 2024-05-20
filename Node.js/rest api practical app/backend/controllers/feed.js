const { validationResult } = require('express-validator');

exports.getPosts = (req, res, next) => {
	res.status(200).json({
		posts: [
			{
				_id: '1',
				title: 'First Post',
				content: 'This is the first post!',
				imageUrl: 'images/duck.webp',
				creator: { name: 'Patrick' },
				createdAt: new Date(),
			},
		],
	});
};

exports.createPost = (req, res, next) => {
	const errors = validationResult(req);
	const { title, content } = req.body;

	if (!errors.isEmpty()) {
		return res.status(422).json({ message: 'Validaiton failed', errors: errors.array() });
	}
	res.status(201).json({
		message: 'Post created successfully!',
		post: {
			_id: new Date().toISOString(),
			title: title,
			content: content,
			creator: { name: 'Patrick' },
			createdAt: new Date(),
		},
	});
};
