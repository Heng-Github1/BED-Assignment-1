document.addEventListener('DOMContentLoaded', () => {
  fetchNews();
});

async function fetchNews() {
  try {
    const response = await fetch('/newsArticle');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const news = await response.json();
    displayNews(news);
  } catch (error) {
    console.error('Error fetching news:', error.message);
    // Display an error message to the user
    document.getElementById('cards-container').innerHTML = `<p>Error loading news: ${error.message}</p>`;
  }
}

function displayNews(newsArray) {
  const container = document.getElementById('cards-container');
  const template = document.getElementById('template-news-card');

  container.innerHTML = ''; // Clear existing content

  newsArray.forEach((newsItem, index) => {
      const cardClone = template.content.cloneNode(true);

      cardClone.querySelector('#news-title').textContent = newsItem.headline;
      cardClone.querySelector('#news-desc').textContent = newsItem.content;
      cardClone.querySelector('#news-source').textContent = newsItem.country;
      cardClone.querySelector('#news-index').textContent = `#${newsItem.newsid}`;

      // You might want to set a default image or use a field from your database if available
      cardClone.querySelector('#news-img').src = 'https://via.placeholder.com/400x200';

      container.appendChild(cardClone);
  });
}

// Function to handle navigation item clicks
function onNavItemClick(category) {
  // You can implement filtering or fetching by category here
  console.log(`Category clicked: ${category}`);
  // For now, we'll just re-fetch all news
  fetchNews();
}

// Function to handle search
document.getElementById('search-button').addEventListener('click', () => {
  const searchTerm = document.getElementById('search-text').value;
  // Implement search functionality here
  console.log(`Search term: ${searchTerm}`);
  // For now, we'll just re-fetch all news
  fetchNews();
});

// Function to reload the page
function reload() {
  location.reload();
}