// Add event listener to the password reset form
document.getElementById('resetForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent the default form submission

    // Get the values from the form inputs
    const username = document.getElementById('resetUsername').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Check if the new password and confirm password match
    if (newPassword !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }

    try {
        // Send a PATCH request to the server to reset the password
        const response = await fetch('/users/reset-password', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, newPassword }) // Send the username and new password in the request body
        });

        if (response.ok) {
            alert('Password reset successfully');
            window.location.href = 'index(users).html'; // Redirect to the sign-in page
        } else {
            const errorData = await response.json();
            alert(errorData.message);
        }
    } catch (error) {
        console.error('Error during password reset:', error);
        alert('Error during password reset. Please try again.');
    }
});
