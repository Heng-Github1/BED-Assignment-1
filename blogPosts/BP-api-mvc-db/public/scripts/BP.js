/*async function fetchBlogPosts() {
  const response = await fetch("/blogPosts");
  const data = await response.json();

  const blogPostList = document.getElementById("blog-post-list");

  data.forEach((blogPost) => {
    const blogPostItem = document.createElement("div");
    blogPostItem.classList.add("book");

    const titleElement = document.createElement("h2");
    titleElement.textContent = blogPost.content;

    const authorElement = document.createElement("p");
    authorElement.textContent = `By: ${blogPost.authorID}`;

    blogPostItem.appendChild(titleElement);
    blogPostItem.appendChild(authorElement);

    blogPostList.appendChild(blogPostItem);
  });
}

fetchBlogPosts();

const createBlogPostForm = document.getElementById("create-blog-post-form");
createBlogPostForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const content = document.getElementById("content").value;
  const authorID = document.getElementById("authorID").value;

  const newBlogPost = {
    content,
    authorID
  };

  const response = await fetch("/blogPosts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(newBlogPost)
  });

  const data = await response.json();
  console.log(data);

  fetchBlogPosts(); // Fetch blog posts again to update the list
});*/