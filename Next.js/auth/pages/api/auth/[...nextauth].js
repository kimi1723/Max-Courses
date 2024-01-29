import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';

import connectToDatabase from '../../../lib/db';
import { verifyPassword } from './auth';

export default NextAuth({
	// session: { jwt: true },
	// session: { strategy: 'jwt' },
	providers: [
		CredentialsProvider({
			async authorize({ email, password }) {
				const client = await connectToDatabase();

				const usersCollection = client.db().collection('users');

				const { email: storedEmail = undefined, password: storedPassword } = await usersCollection.findOne({ email });

				if (!storedEmail || !storedPassword) {
					client.close();
					throw new Error('User not found!');
				}

				const isPasswordValid = await verifyPassword(password, storedPassword);

				if (!isPasswordValid) {
					client.close();
					throw new Error('Password is invalid!');
				}

				client.close();

				return {
					email,
				};
			},
		}),
	],
});
