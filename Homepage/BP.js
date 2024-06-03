/*back button*/
document.getElementById("back-link").addEventListener("click", () => {
  history.go(-1);
});
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');

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