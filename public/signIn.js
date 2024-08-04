// Add event listener to the login form
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent the default form submission

    // Get the values from the form inputs
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    try {
        // Send a POST request to the server to log in the user
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password }) // Send the username and password in the request body
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token); // Store the JWT token in local storage
            alert('Login successful');
            window.location.href = 'index.html'; // Redirect to account page after successful login
        } else {
            const errorData = await response.json();
            alert(errorData.message);
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('Error during login. Please try again.');
    }
});
