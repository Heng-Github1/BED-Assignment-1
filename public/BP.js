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
          postCard.classList.add('col-md-6', 'col-lg-4', 'mb-4', 'blog-post'); // Added 'blog-post' class

          postCard.innerHTML = `
              <div class="card h-100">
                  <div class="card-body">
                      <h5 class="card-title">${post.title}</h5>
                      <p class="card-text">${post.content}</p>
                      <p class="text-muted">AuthorID: ${post.authorID}</p>
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

// My blog posts link
document.getElementById("my-blog-posts-link").addEventListener("click", () => {
  window.location.href = "BP(my).html";
});

// Search functionality
document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('search');

  searchInput.addEventListener('input', function() {
      const searchTerm = searchInput.value.toLowerCase().trim();
      const blogPosts = document.querySelectorAll('.blog-post');

      blogPosts.forEach(post => {
          const content = post.querySelector('.card-text').textContent.toLowerCase();
          const title = post.querySelector('.card-title').textContent.toLowerCase();
          const isVisible = content.includes(searchTerm) || title.includes(searchTerm);
          post.style.display = isVisible ? 'block' : 'none';
      });
  });
});

