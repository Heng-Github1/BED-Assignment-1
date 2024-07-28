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
        for (const post of blogPosts) {
            const postCard = document.createElement('div');
            postCard.classList.add('col-md-6', 'col-lg-4', 'mb-4', 'blog-post');

            postCard.innerHTML = `
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">${post.title}</h5>
                        <p class="card-text">${post.content}</p>
                        <p class="text-muted">AuthorID: ${post.authorID}</p>
                        <p class="text-muted">Published: ${new Date(post.bpCreated).toLocaleDateString()}</p>
                        <button class="btn btn-primary" onclick="showComments(${post.BPid})">View Comments</button>
                        <div id="comments-section-${post.BPid}" class="comments-section" style="display: none;">
                            <div class="comment-form">
                                <textarea id="comment-input-${post.BPid}" class="form-control mb-2" placeholder="Write a comment..."></textarea>
                                <button class="btn btn-success" onclick="submitComment(${post.BPid})">Submit</button>
                            </div>
                            <div id="comments-container-${post.BPid}" class="comments-container mt-3">
                                <!-- Comments will be inserted here -->
                            </div>
                        </div>
                    </div>
                </div>
            `;

            blogPostsContainer.appendChild(postCard);
        }
    } catch (error) {
        console.error('Error fetching blog posts:', error);
    }
});

// Show comments section for a specific blog post
async function showComments(BPid) {
    const commentsSection = document.getElementById(`comments-section-${BPid}`);
    const commentsContainer = document.getElementById(`comments-container-${BPid}`);

    commentsSection.style.display = 'block'; // Ensure the comments section is displayed

    try {
        const response = await fetch(`/comments/${BPid}`);
        if (!response.ok) {
            throw new Error('Failed to fetch comments');
        }
        const comments = await response.json();
        
        // Clear previous comments (if any)
        commentsContainer.innerHTML = '';

        // Loop through comments and create HTML elements
        for (const comment of comments) {
            const commentElement = document.createElement('div');
            commentElement.classList.add('comment');

            commentElement.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <p class="card-text">${comment.commentContent}</p>
                        <p class="text-muted">AuthorID: ${comment.authorID}</p>
                        <p class="text-muted">Published: ${new Date(comment.commentCreated).toLocaleString()}</p>
                    </div>
                </div>
            `;

            commentsContainer.appendChild(commentElement);
        }
    } catch (error) {
        console.error('Error fetching comments:', error);
    }
}

// Submit a new comment
async function submitComment(BPid) {
    const commentInput = document.getElementById(`comment-input-${BPid}`);
    const commentContent = commentInput.value.trim();

    if (commentContent === '') {
        alert('Comment cannot be empty');
        return;
    }

    const newComment = {
        BPid,
        authorID: getCurrentAuthorID(), // Use the current logged-in user ID
        commentContent
    };

    try {
        const response = await fetch('/comments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newComment)
        });

        if (!response.ok) {
            throw new Error('Failed to submit comment');
        }

        // Clear the comment input
        commentInput.value = '';

        // Refresh the comments section
        showComments(BPid);
    } catch (error) {
        console.error('Error submitting comment:', error);
    }
}

// Function to get the current logged-in user's authorID
function getCurrentAuthorID() {
    // Replace with actual logic to get the logged-in user's authorID
    return localStorage.getItem('authorID') || 1; // Example logic using localStorage
}

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

    searchInput.addEventListener('input', function(event) {
        const searchQuery = event.target.value.toLowerCase();
        const blogPosts = document.querySelectorAll('.blog-post');

        blogPosts.forEach(function(post) {
            const title = post.querySelector('.card-title').textContent.toLowerCase();
            const content = post.querySelector('.card-text').textContent.toLowerCase();

            post.style.display = title.includes(searchQuery) || content.includes(searchQuery) ? '' : 'none';
        });
    });
});
