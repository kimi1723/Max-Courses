
import classes from './newsletter-registration.module.css';

function NewsletterRegistration() {
  async function registrationHandler(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const reqBody = Object.fromEntries(formData.entries());

    const { res } = await fetch('http://localhost:3000/api/newsletter', {
      method: 'POST',
      body: JSON.stringify(reqBody),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());

    console.log(res);

}


  return (
    <section className={classes.newsletter}>
      <h2>Sign up to stay updated!</h2>
      <form onSubmit={registrationHandler}>
        <div className={classes.control}>
          <input
            type='email'
            id='email'
            name="email"
            placeholder='Your email'
            aria-label='Your email'
          />
          <button type="submit">Register</button>
        </div>
      </form>
    </section>
  );
}

export default NewsletterRegistration;
