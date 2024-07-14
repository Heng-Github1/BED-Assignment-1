document.addEventListener('DOMContentLoaded', () => {
    const blogPostsList = document.getElementById('blogPostsList');
  
    // Function to fetch blog posts from backend API
    async function fetchBlogPosts() {
      try {
        const response = await fetch('/blogPosts');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const blogPosts = await response.json();
        displayBlogPosts(blogPosts);
      } catch (error) {
        console.error('Error fetching blog posts:', error.message);
        blogPostsList.innerHTML = '<p>Error fetching blog posts</p>';
      }
    }
  
    // Function to display blog posts in the UI
    function displayBlogPosts(blogPosts) {
      blogPostsList.innerHTML = ''; // Clear previous content
      blogPosts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.classList.add('blog-post');
        postElement.innerHTML = `
          <h2>${post.content}</h2>
          <p>Author: User ID ${post.authorID}</p>
          <p>Created: ${new Date(post.bpCreated).toLocaleString()}</p>
          <p>Last Modified: ${new Date(post.bpModified).toLocaleString()}</p>
          <hr>
        `;
        blogPostsList.appendChild(postElement);
      });
    }
  
    // Fetch blog posts when the page loads
    fetchBlogPosts();
  });
  