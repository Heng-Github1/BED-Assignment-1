document.getElementById("back-link").addEventListener("click", () => {
  history.go(-1);
});

document.getElementById("create-post-btn").addEventListener("click", () => {
  document.getElementById("create-post-form-container").style.display = "block";
});

document.getElementById('create-post-form').addEventListener('submit', async function(event) {
  event.preventDefault();

  const content = document.getElementById('post-content').value;
  const authorID = document.getElementById('post-author-id').value;

  const postData = {
      content,
      authorID,
      bpCreated: new Date().toISOString(),
      bpModified: new Date().toISOString()
  };

  try {
      const response = await fetch('/blogPosts', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(postData)
      });

      if (!response.ok) {
          throw new Error('Error creating blog post');
      }

      const data = await response.json();

      if (data) {
          alert("Blog post created successfully!");
          document.getElementById('create-post-form').reset();
          // Optionally, you can refresh the page or update the list of blog posts here
          window.location.reload();
      } else {
          console.error("Blog post data not found in server response.");
          alert("Failed to create blog post. Please try again.");
      }
  } catch (error) {
      const errorMessage = error.message || "An error occurred while creating the blog post. Please try again later.";
      alert("Error: " + errorMessage);
      console.error('Error:', error);
  }
});

document.getElementById('update-post-btn').addEventListener('click', async function () {
  const updateContainer = document.querySelector('.update-container');
  const updatePostsList = document.getElementById('update-posts-list');

  // Toggle the display of the update container
  if (updateContainer.classList.contains('d-none')) {
      updateContainer.classList.remove('d-none');
      await fetchBlogPostsForUpdate();
  } else {
      updateContainer.classList.add('d-none');
      updatePostsList.innerHTML = ''; // Clear the list when hiding
  }
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
          infoContainer.textContent = `Post ID: ${post.BPid} | Created on: ${new Date(post.bpCreated).toLocaleString()}`;

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

function displayUpdateForm(post) {
  // Create a form for updating the blog post
  const updateForm = document.createElement('form');
  updateForm.className = 'update-form';
  updateForm.innerHTML = `
      <label for="update-content">Content:</label><br>
      <textarea id="update-content" name="update-content" rows="4" cols="50">${post.content}</textarea><br>
      <label for="update-author-id">Author ID:</label><br>
      <input type="text" id="update-author-id" name="update-author-id" value="${post.authorID}"><br><br>
      <button type="submit" class="btn btn-primary btn-sm">Submit Update</button>
  `;

  // Handle form submission
  updateForm.addEventListener('submit', async function(event) {
      event.preventDefault();

      const newContent = document.getElementById('update-content').value;
      const newAuthorID = document.getElementById('update-author-id').value;

      try {
          const response = await fetch(`/blogPosts/${post.BPid}`, {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({
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
          const updateContainer = document.querySelector('.update-container');
          updateContainer.classList.add('d-none');
      } catch (error) {
          console.error('Error updating blog post:', error);
          alert('Failed to update blog post. Please try again.');
      }
  });

  // Clear previous content and append the form to the update container
  const updateContainer = document.querySelector('.update-container');
  updateContainer.innerHTML = '';
  updateContainer.appendChild(updateForm);
}

document.getElementById('delete-post-btn').addEventListener('click', async function () {
  const deleteContainer = document.querySelector('.delete-container');
  const deletePostsList = document.getElementById('delete-posts-list');

  // Toggle the display of the delete container
  if (deleteContainer.classList.contains('d-none')) {
      deleteContainer.classList.remove('d-none');
      await fetchBlogPostsForDeletion();
  } else {
      deleteContainer.classList.add('d-none');
      deletePostsList.innerHTML = ''; // Clear the list when hiding
  }
});

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
          infoContainer.textContent = `Post ID: ${post.BPid} | Created on: ${new Date(post.bpCreated).toLocaleString()}`;

          const deleteButton = document.createElement('button');
          deleteButton.className = 'btn btn-danger btn-sm';
          deleteButton.textContent = 'Delete';

          listItem.appendChild(infoContainer);
          listItem.appendChild(deleteButton);

          deletePostsList.appendChild(listItem);

          // Add event listener to delete button
          deleteButton.addEventListener('click', async () => {
              if (confirm(`Are you sure you want to delete post with ID ${post.BPid}?`)) {
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
