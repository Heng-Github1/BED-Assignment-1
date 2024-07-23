document.getElementById("back-link").addEventListener("click", () => {
    history.go(-1);
});

document.getElementById("create-post-btn").addEventListener("click", () => {
    showCreatePostForm();
});

document.getElementById('create-post-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    // Submit functionality remains the same
});

document.getElementById('update-post-btn').addEventListener('click', async function () {
    showUpdatePostsSection();
});

document.getElementById('delete-post-btn').addEventListener('click', async function () {
    showDeletePostsSection();
});

async function fetchBlogPostsForUpdate() {
    try {
        const response = await fetch('/blogPosts');
        const blogPosts = await response.json();
        const updatePostsList = document.getElementById('update-posts-list');
        updatePostsList.innerHTML = '';

        blogPosts.forEach(post => {
            const listItem = document.createElement('div');
            listItem.className = 'list-group-item d-flex justify-content-between align-items-center';

            const infoContainer = document.createElement('div');
            infoContainer.textContent = `Title: ${post.title} | Post ID: ${post.BPid} | Created on: ${new Date(post.bpCreated).toLocaleString()}`;

            const updateButton = document.createElement('button');
            updateButton.className = 'btn btn-success btn-sm';
            updateButton.textContent = 'Update';

            listItem.appendChild(infoContainer);
            listItem.appendChild(updateButton);

            updatePostsList.appendChild(listItem);

            // Add event listener to update button
            updateButton.addEventListener('click', () => {
                // Display update form or popup
                displayUpdateForm(post);
            });
        });
    } catch (error) {
        console.error('Error fetching blog posts:', error);
    }
}

async function fetchBlogPostsForDeletion() {
    try {
        const response = await fetch('/blogPosts');
        const blogPosts = await response.json();
        const deletePostsList = document.getElementById('delete-posts-list');
        deletePostsList.innerHTML = '';

        blogPosts.forEach(post => {
            const listItem = document.createElement('div');
            listItem.className = 'list-group-item d-flex justify-content-between align-items-center';

            const infoContainer = document.createElement('div');
            infoContainer.textContent = `Title: ${post.title} | Post ID: ${post.BPid} | Created on: ${new Date(post.bpCreated).toLocaleString()}`;

            const deleteButton = document.createElement('button');
            deleteButton.className = 'btn btn-danger btn-sm';
            deleteButton.textContent = 'Delete';

            listItem.appendChild(infoContainer);
            listItem.appendChild(deleteButton);

            deletePostsList.appendChild(listItem);

            // Add event listener to delete button
            deleteButton.addEventListener('click', async () => {
                if (confirm(`Are you sure you want to delete post "${post.title}" with BPid ${post.BPid}?`)) {
                    try {
                        const response = await fetch(`/blogPosts/${post.BPid}`, {
                            method: 'DELETE',
                        });

                        if (!response.ok) {
                            throw new Error('Failed to delete blog post');
                        }

                        alert(`Blog post with ID ${post.BPid} deleted successfully!`);
                        // Optionally, you can refresh the list of blog posts here
                        fetchBlogPostsForDeletion(); // Refresh the list after deletion
                    } catch (error) {
                        console.error('Error deleting blog post:', error);
                        alert('Failed to delete blog post. Please try again.');
                    }
                }
            });
        });
    } catch (error) {
        console.error('Error fetching blog posts:', error);
    }
}

function showCreatePostForm() {
    // Show create post form
    document.getElementById("create-post-form-container").style.display = "block";

    // Hide update and delete sections
    hideUpdatePostsSection();
    hideDeletePostsSection();
}

function showUpdatePostsSection() {
    const updateContainer = document.querySelector('.update-container');
    const updatePostsList = document.getElementById('update-posts-list');

    // Toggle the display of the update container
    if (updateContainer.classList.contains('d-none')) {
        updateContainer.classList.remove('d-none');
        fetchBlogPostsForUpdate();
    } else {
        updateContainer.classList.add('d-none');
        updatePostsList.innerHTML = ''; // Clear the list when hiding
    }

    // Hide create and delete sections
    hideCreatePostForm();
    hideDeletePostsSection();
}

function showDeletePostsSection() {
    const deleteContainer = document.querySelector('.delete-container');
    const deletePostsList = document.getElementById('delete-posts-list');

    // Toggle the display of the delete container
    if (deleteContainer.classList.contains('d-none')) {
        deleteContainer.classList.remove('d-none');
        fetchBlogPostsForDeletion();
    } else {
        deleteContainer.classList.add('d-none');
        deletePostsList.innerHTML = ''; // Clear the list when hiding
    }

    // Hide create and update sections
    hideCreatePostForm();
    hideUpdatePostsSection();
}

function hideCreatePostForm() {
    document.getElementById("create-post-form-container").style.display = "none";
}

function hideUpdatePostsSection() {
    const updateContainer = document.querySelector('.update-container');
    const updatePostsList = document.getElementById('update-posts-list');
    updateContainer.classList.add('d-none');
    updatePostsList.innerHTML = ''; // Clear the list when hiding
}

function hideDeletePostsSection() {
    const deleteContainer = document.querySelector('.delete-container');
    const deletePostsList = document.getElementById('delete-posts-list');
    deleteContainer.classList.add('d-none');
    deletePostsList.innerHTML = ''; // Clear the list when hiding
}

function displayUpdateForm(post) {
    // Create a form for updating the blog post
    const updateForm = document.createElement('form');
    updateForm.className = 'update-form'; // Apply the update-form class

    updateForm.innerHTML = `
        <div class="mb-3">
            <label for="update-title" class="form-label">Title</label>
            <textarea class="form-control" id="update-title" name="update-title" rows="4">${post.title}</textarea>
        </div>
        <div class="mb-3">
            <label for="update-content" class="form-label">Content</label>
            <textarea class="form-control" id="update-content" name="update-content" rows="4">${post.content}</textarea>
        </div>
        <div class="mb-3">
            <label for="update-author-id" class="form-label">Author ID</label>
            <input type="text" class="form-control" id="update-author-id" name="update-author-id" value="${post.authorID}">
        </div>
        <button type="submit" class="btn btn-primary">Submit Update</button>
    `;

    // Handle form submission
    updateForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const newTitle = document.getElementById('update-title').value;
        const newContent = document.getElementById('update-content').value;
        const newAuthorID = document.getElementById('update-author-id').value;

        try {
            const response = await fetch(`/blogPosts/${post.BPid}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: newTitle,
                    content: newContent,
                    authorID: newAuthorID
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update blog post');
            }

            alert(`Blog post with ID ${post.BPid} updated successfully!`);

            // Optionally, refresh the list of blog posts for update
            fetchBlogPostsForUpdate(); // Refresh the list after update

            // Hide update form
            hideUpdatePostsSection();
        } catch (error) {
            console.error('Error updating blog post:', error);
            alert('Failed to update blog post. Please try again.');
        }
    });

    // Clear previous content and append the form to the update container
    const updateContainer = document.querySelector('.update-container');
    updateContainer.innerHTML = ''; // Clear previous content
    updateContainer.appendChild(updateForm);
}

// Initial setup: Hide all sections
hideCreatePostForm();
hideUpdatePostsSection();
hideDeletePostsSection();
