import { useState, useRef } from 'react';
import { signIn } from 'next-auth/react';

import classes from './auth-form.module.css';

async function createUser(credentials) {
	const response = await fetch('api/auth/signup', {
		method: 'POST',
		body: JSON.stringify(credentials),
		headers: {
			'Content-Type': 'application/json',
		},
	});

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message || 'Someting went wrong!');
	}

	return data;
}

function AuthForm() {
	const emailInputRef = useRef();
	const passwordInputRef = useRef();
	const [isLogin, setIsLogin] = useState(true);

	function switchAuthModeHandler() {
		setIsLogin(prevState => !prevState);
	}

	async function submitHandler(e) {
		e.preventDefault();

		const enteredEmail = emailInputRef.current.value;
		const enteredPassword = passwordInputRef.current.value;

		if (isLogin) {
			const result = await signIn('credentials', {
				redirect: false,
				email: enteredEmail,
				password: enteredPassword,
			});

			if (result.error) {
				console.log(result.error || 'Something unexpected happend!');

				return;
			}

			return;
		}

		try {
			const result = await createUser({
				email: enteredEmail,
				password: enteredPassword,
			});

			console.log(result);
		} catch (error) {
			console.log(error);
		}
	}

	return (
		<section className={classes.auth}>
			<h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
			<form onSubmit={submitHandler}>
				<div className={classes.control}>
					<label htmlFor="email">Your Email</label>
					<input type="email" id="email" required ref={emailInputRef} />
				</div>
				<div className={classes.control}>
					<label htmlFor="password">Your Password</label>
					<input type="password" id="password" required ref={passwordInputRef} />
				</div>
				<div className={classes.actions}>
					<button>{isLogin ? 'Login' : 'Create Account'}</button>
					<button type="button" className={classes.toggle} onClick={switchAuthModeHandler}>
						{isLogin ? 'Create new account' : 'Login with existing account'}
					</button>
				</div>
			</form>
		</section>
	);
}

export default AuthForm;
