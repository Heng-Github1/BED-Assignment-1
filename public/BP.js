document.addEventListener('DOMContentLoaded', async function() {
  try {
    const response = await fetch('/blogPosts');
    if (!response.ok) {
      throw new Error('Failed to fetch blog posts');
    }
    const blogPosts = await response.json();
    const blogPostsContainer = document.getElementById('blog-posts-inner-container');

    // Clear previous content (if any)
    blogPostsContainer.innerHTML = '';

    // Loop through blogPosts and create HTML elements
    blogPosts.forEach(post => {
      const postCard = document.createElement('div');
      postCard.classList.add('col-md-6', 'col-lg-4', 'mb-4');

      postCard.innerHTML = `
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">Post ID: ${post.BPid}</h5>
            <p class="card-text">${post.content}</p>
            <p class="text-muted">Author: ${post.authorID}</p>
            <p class="text-muted">Published: ${new Date(post.bpCreated).toLocaleDateString()}</p>
          </div>
        </div>
      `;

      blogPostsContainer.appendChild(postCard);
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
  }
});

// Back button
document.getElementById("back-link").addEventListener("click", () => {
  history.go(-1);
});

// Search bar
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
// BP.js
searchBtn.addEventListener('click', () => {
  const searchQuery = searchInput.value.trim();
  if (searchQuery !== '') {
    fetch(`/blogPosts?searchTerm=${searchQuery}`)
      .then(response => response.json())
      .then(data => {
        const blogPostsContainer = document.getElementById('blog-posts-inner-container');
        blogPostsContainer.innerHTML = ''; // Clear previous content

        data.forEach(post => {
          const postCard = document.createElement('div');
          postCard.classList.add('col-md-6', 'col-lg-4', 'mb-4');

          postCard.innerHTML = `
            <div class="card h-100">
              <div class="card-body">
                <h5 class="card-title">Post ID: ${post.BPid}</h5>
                <p class="card-text">${post.content}</p>
                <p class="text-muted">Author: ${post.authorID}</p>
                <p class="text-muted">Published: ${new Date(post.bpCreated).toLocaleDateString()}</p>
              </div>
            </div>
          `;

          blogPostsContainer.appendChild(postCard);
        });
      })
      .catch(error => {
        console.error(error);
      });
  }
});

// My blog posts
document.getElementById("my-blog-posts-link").addEventListener("click", () => {
  window.location.href = "BP(my).html"; 
});

