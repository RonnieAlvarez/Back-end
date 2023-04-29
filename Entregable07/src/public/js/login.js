const form = document.getElementById('loginForm');
console.log(form)
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const formObject = Object.fromEntries(formData.entries());

  try {
    const response = await fetch('/api/sessions/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formObject),
    });

    if (response.ok) {
      window.location.replace('/users/profile');
    } else {
      throw new Error('Unable to log in');
    }
  } catch (error) {
    console.error(error);
  }
});