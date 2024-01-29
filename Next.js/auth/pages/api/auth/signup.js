import connectToDatabase from '../../../lib/db';
import { hashPassword } from './auth';

export default async function handler(req, res) {
	if (req.method !== 'POST') {
		res.status(405).json({ message: 'Invalid method!' });

		return;
	}

	const { email, password } = req.body;

	if (!email || !email.includes('@') || !password || password.trim().length < 7) {
		res.status(422).json({ message: 'Invalid input!' });

		return;
	}

	const client = await connectToDatabase();
	const db = client.db();

	const existingUser = await db.collection('users').findOne({
		email,
	});

	if (existingUser) {
		res.status(422).json({ message: 'User already exists!' });
		client.close();

		return;
	}

	const hashedPassword = await hashPassword(password);

	const {acknowledged} = await db.collection('users').insertOne({
		email,
		password: hashedPassword,
	});

	if(!acknowledged) {
        res.status()
    }

	res.status(201).json({ message: 'Successfuly created a user account!' });
	client.close();
}
