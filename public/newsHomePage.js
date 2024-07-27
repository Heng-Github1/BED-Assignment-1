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
      // Display an error message
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
        cardClone.querySelector('#news-img').src = 'https://via.placeholder.com/400x200';
  
        container.appendChild(cardClone);
    });
  }
  
  // Function to handle navigation item clicks
  function onNavItemClick(category) {
    console.log(`Category clicked: ${category}`);
    fetchNews();
  }
  
  // Function to handle search
  document.getElementById('search-button').addEventListener('click', () => {
    const searchTerm = document.getElementById('search-text').value;
    console.log(`Search term: ${searchTerm}`);
    fetchNews();
  });
  
  // Function to reload the page
  function reload() {
    location.reload();
  }