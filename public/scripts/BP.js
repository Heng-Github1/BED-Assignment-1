//back button
document.getElementById("back-link").addEventListener("click", () => {
  history.go(-1);
});
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');

//my blog posts
document.getElementById("my-blog-posts-link").addEventListener("click", () => {
  window.location.href = "BP(my).html"; 
});


//search bar
searchBtn.addEventListener('click', () => {
  const searchQuery = searchInput.value.trim();
  if (searchQuery !== '') {
    fetch(`/blog-posts?search=${searchQuery}`)
      .then(response => response.json())
      .then(data => {
        // Handle the search results data
      })
      .catch(error => {
        console.error(error);
      });
  }
});

//retrieve posts
function fetchAndDisplayBlogPosts() {
  fetch('/api/blog-posts') // Replace '/api/blog-posts' with your actual endpoint
      .then(response => {
          if (!response.ok) {
              throw new Error('Failed to fetch blog posts');
          }
          return response.json();
      })
      .then(blogPosts => {
          const blogPostsContainer = document.querySelector('.blog-posts-container');
          // Clear previous content
          blogPostsContainer.innerHTML = '';
          // Append each blog post to the container
          blogPosts.forEach(blogPost => {
              const blogPostElement = document.createElement('div');
              blogPostElement.classList.add('blog-post');
              blogPostElement.innerHTML = `
                  <h2>${blogPost.title}</h2>
                  <p>${blogPost.content}</p>
                  <p>Author: ${blogPost.author}</p>
              `;
              blogPostsContainer.appendChild(blogPostElement);
          });
      })
      .catch(error => {
          console.error('Error fetching blog posts:', error.message);
      });
}

// Call the function to fetch and display blog posts when the page loads
window.addEventListener('load', fetchAndDisplayBlogPosts);
