/*back button*/
document.getElementById("back-link").addEventListener("click", () => {
  history.go(-1);
});

// Event listener for search button
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');

// Fetch and display user profile details
async function fetchUserProfile() {
    try {
        const response = await fetch('/users/profile', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (response.ok) {
            const userProfile = await response.json();
            document.getElementById('username').textContent = userProfile.username;
            document.getElementById('email').textContent = userProfile.email;
            document.getElementById('role').textContent = userProfile.role;
        } else {
            console.error('Failed to fetch user profile');
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
    }
}

// Function to fetch and display all users
async function fetchAllUsers() {
    try {
        const response = await fetch('/users', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (response.ok) {
            const users = await response.json();
            const userTable = document.getElementById('userTableBody');
            userTable.innerHTML = '';
            users.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.userID}</td>
                    <td>${user.username}</td>
                    <td>${user.email}</td>
                    <td>${user.role}</td>
                `;
                userTable.appendChild(row);
            });
        } else {
            console.error('Failed to fetch users');
        }
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

// Function to update user details
async function updateUserDetails(userID, updatedDetails) {
    try {
        const response = await fetch(`/users/${userID}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(updatedDetails)
        });
        if (response.ok) {
            alert('User updated successfully');
            fetchAllUsers(); // Refresh the user list
        } else {
            console.error('Failed to update user');
        }
    } catch (error) {
        console.error('Error updating user:', error);
    }
}

// Function to delete a user
async function deleteUser(userID) {
    try {
        const response = await fetch(`/users/${userID}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (response.ok) {
            alert('User deleted successfully');
            fetchAllUsers(); // Refresh the user list
        } else {
            console.error('Failed to delete user');
        }
    } catch (error) {
        console.error('Error deleting user:', error);
    }
}

// Initial fetch of user profile and all users on page load
fetchUserProfile();
fetchAllUsers();

// Event listener for the search button
searchBtn.addEventListener('click', async () => {
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
        try {
            const response = await fetch(`/users/search?query=${encodeURIComponent(searchTerm)}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                const users = await response.json();
                const userTable = document.getElementById('userTableBody');
                userTable.innerHTML = '';
                users.forEach(user => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${user.userID}</td>
                        <td>${user.username}</td>
                        <td>${user.email}</td>
                        <td>${user.role}</td>
                    `;
                    userTable.appendChild(row);
                });
            } else {
                console.error('Failed to fetch search results');
            }
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    } else {
        fetchAllUsers(); // Fetch all users if no search term is provided
    }
});
