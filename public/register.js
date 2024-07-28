// Add event listener to the registration form
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent the default form submission

    // Get the values from the form inputs
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const reEnterPassword = document.getElementById('reEnterPassword').value;
    const role = document.getElementById('role').value;

    // Check if the password and re-enter password match
    if (password !== reEnterPassword) {
        alert('Passwords do not match.');
        return;
    }

    try {
        // Send a POST request to the server to register the user
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password, role }) // Send the user data in the request body
        });

        if (response.ok) {
            alert('User registered successfully');
            window.location.href = 'index.html'; // Redirect to the sign-in page
        } else {
            const errorData = await response.json();
            alert(errorData.message);
        }
    } catch (error) {
        console.error('Error during registration:', error);
        alert('Error during registration. Please try again.');
    }
});
