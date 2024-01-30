import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

import ProfileForm from './profile-form';
import classes from './user-profile.module.css';

function UserProfile() {
	const router = useRouter();
	const { data: session, status } = useSession({
		required: true,
		onUnauthenticated() {
			router.push('/auth');
		},
	});

	const loading = status === 'loading';

	if (loading) {
		return <p className={classes.profile}>Loading...</p>;
	}
	// Redirect away if NOT auth

	return (
		<section className={classes.profile}>
			<h1>Your User Profile</h1>
			<ProfileForm />
		</section>
	);
}

export default UserProfile;
