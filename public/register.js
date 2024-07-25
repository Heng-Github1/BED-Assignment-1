document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const reEnterPassword = document.getElementById('reEnterPassword').value;
    const role = document.getElementById('role').value;

    if (password !== reEnterPassword) {
        alert('Passwords do not match.');
        return;
    }

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password, role })
        });

        if (response.ok) {
            alert('User registered successfully');
            window.location.href = 'index(users).html'; // Redirect to the sign-in page
        } else {
            const errorData = await response.json();
            alert(errorData.message);
        }
    } catch (error) {
        console.error('Error during registration:', error);
        alert('Error during registration. Please try again.');
    }
});
