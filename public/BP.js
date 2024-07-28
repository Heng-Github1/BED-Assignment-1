// Back button 
document.getElementById("back-link").addEventListener("click", () => { 
    history.go(-1); 
}); 
 
// My blog posts link 
document.getElementById("my-blog-posts-link").addEventListener("click", () => { 
    window.location.href = "BP(my).html"; 
});

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
                    </div>
                </div>
            `;

            blogPostsContainer.appendChild(postCard);
        }
    } catch (error) {
        console.error('Error fetching blog posts:', error);
    }
});

let currentBPid;

async function showComments(BPid) {
    currentBPid = BPid;
    const commentsModal = new bootstrap.Modal(document.getElementById('commentsModal'));
    const commentsContainer = document.getElementById('modal-comments-container');

    // Fetch and display comments
    try {
        const response = await fetch(`/comments/${BPid}`);
        if (!response.ok) {
            throw new Error('Failed to fetch comments');
        }
        const comments = await response.json();

        // Log the response to inspect the data
        console.log('Fetched comments:', comments);

        // Ensure comments is an array
        if (!Array.isArray(comments)) {
            throw new Error('Comments data is not an array');
        }

        // Clear previous comments (if any)
        commentsContainer.innerHTML = '';

        // Loop through comments and create HTML elements
        for (const comment of comments) {
            const commentElement = document.createElement('div');
            commentElement.classList.add('comment');
            commentElement.innerHTML = `
                <p><strong>${comment.authorID}</strong>: ${comment.commentContent}</p>
                <p class="text-muted">${new Date(comment.commentCreated).toLocaleDateString()}</p>
            `;
            commentsContainer.appendChild(commentElement);
        }

        commentsModal.show();
    } catch (error) {
        console.error('Error fetching comments:', error);
    }
}

async function submitModalComment() {
    const commentInput = document.getElementById('modal-comment-input');
    const commentContent = commentInput.value;

    if (commentContent.trim() === '') {
        alert('Comment cannot be empty');
        return;
    }

    const newCommentData = {
        BPid: currentBPid,
        authorID: 1, // Replace with actual author ID
        commentContent: commentContent
    };

    try {
        const response = await fetch('/comments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newCommentData)
        });

        if (!response.ok) {
            throw new Error('Failed to submit comment');
        }

        const newComment = await response.json();

        // Clear the comment input
        commentInput.value = '';

        // Append the new comment to the comments container
        const commentsContainer = document.getElementById('modal-comments-container');
        const commentElement = document.createElement('div');
        commentElement.classList.add('comment');
        commentElement.innerHTML = `
            <p><strong>${newComment.authorID}</strong>: ${newComment.commentContent}</p>
            <p class="text-muted">${new Date(newComment.commentCreated).toLocaleDateString()}</p>
        `;
        commentsContainer.appendChild(commentElement);
    } catch (error) {
        console.error('Error submitting comment:', error);
    }
}

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
