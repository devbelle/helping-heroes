async function loginFormHandler(event) {
    event.preventDefault();
  
    const username = document.querySelector('#email-login').value.trim();
    const password = document.querySelector('#password-login').value.trim();
  
    if (username && password) {
      const response = await fetch('/api/users/login', {
        method: 'post',
        body: JSON.stringify({
        username,
        password
        }),
        headers: { 'Content-Type': 'application/json' }
      });
  
      if (response.ok) {
        document.location.replace('/');
      } else {
        alert(response.statusText);
      }
    }
  }
  
  async function signupFormHandler(event) {
    event.preventDefault();
  
    const username = document.querySelector('#username-signup').value.trim();
    const email = document.querySelector('#email-signup').value.trim();
    const password = document.querySelector('#password-signup').value.trim();
  
    if (username && email && password) {
      const response = await fetch('/api/users', {
        method: 'post',
        body: JSON.stringify({
        username,
        email,
        password
        }),
        headers: { 'Content-Type': 'application/json' }
      });
  
      if (response.ok) {
      const loginResponse = await fetch ('/api/users/login', {
        method: 'post',
        body: JSON.stringify({
        username,
        password
        }),
        headers: { 'Content-Type': 'application/json' }
      });

      if (loginResponse.ok) {
      document.location.replace('/');
      } else {
        alert(loginResponse.statusText);
      }
      
      } else {
        alert(response.statusText);
      }
    }
  }
  
  document.querySelector('.login-form').addEventListener('submit', loginFormHandler);
  
  document.querySelector('.signup-form').addEventListener('submit', signupFormHandler);