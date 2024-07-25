// updateDeleteNews.js

document.addEventListener('DOMContentLoaded', () => {
    const deleteForm = document.getElementById('delete-news-form');
    deleteForm.addEventListener('submit', handleDeleteSubmit);
    
    const updateForm = document.getElementById('update-news-form');
    updateForm.addEventListener('submit', handleUpdateSubmit);
  });
  
  async function handleDeleteSubmit(event) {
    event.preventDefault();
    const newsIndex = document.getElementById('delete-news-index').value;
    
    // Remove the '#' if it's included in the input
    const newsId = newsIndex.replace('#', '');
  
    try {
      const response = await fetch(`/newsArticle/${newsId}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      // If deletion was successful, update the UI
      removeNewsCard(newsId);
      updateNewsIndexes();
      
      // Clear the input field
      document.getElementById('delete-news-index').value = '';
      
      // Show a success message
      showMessage('News article deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting news:', error.message);
      showMessage(`Error deleting news: ${error.message}`, 'error');
    }
  }
  
  async function handleUpdateSubmit(event) {
    event.preventDefault();
    const newsId = document.getElementById('update-news-id').value;
    const headline = document.getElementById('update-news-headline').value;
    const content = document.getElementById('update-news-content').value;
    const country = document.getElementById('update-news-country').value;
  
    const updatedNewsData = {
      headline,
      content,
      country
    };
  
    try {
        console.log('Sending update request:', newsId, updatedNewsData);
        const response = await fetch(`/newsArticle/${newsId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedNewsData),
        });
        console.log('Update response:', response.status, await response.text());
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const updatedNews = await response.json();
  
      // Update the UI with the new data
      updateNewsCard(newsId, updatedNews);
      
      // Clear the input fields
      document.getElementById('update-news-id').value = '';
      document.getElementById('update-news-headline').value = '';
      document.getElementById('update-news-content').value = '';
      document.getElementById('update-news-country').value = '';
      
      // Show a success message
      showMessage('News article updated successfully', 'success');
    } catch (error) {
      console.error('Error updating news:', error.message);
      showMessage(`Error updating news: ${error.message}`, 'error');
    }
  }
  
  function removeNewsCard(newsId) {
    const newsCard = document.querySelector(`[data-news-id="${newsId}"]`);
    if (newsCard) {
      newsCard.remove();
    }
  }
  
  function updateNewsCard(newsId, updatedNews) {
    const newsCard = document.querySelector(`[data-news-id="${newsId}"]`);
    if (newsCard) {
      newsCard.querySelector('#news-title').textContent = updatedNews.headline;
      newsCard.querySelector('#news-desc').textContent = updatedNews.content;
      newsCard.querySelector('#news-source').textContent = updatedNews.country;
    }
  }
  
  function updateNewsIndexes() {
    const newsCards = document.querySelectorAll('.news-card');
    newsCards.forEach((card, index) => {
      const newsIndex = card.querySelector('#news-index');
      if (newsIndex) {
        newsIndex.textContent = `#${index + 1}`;
      }
    });
  }
  
  function showMessage(message, type) {
    const messageElement = document.getElementById('message');
    messageElement.textContent = message;
    messageElement.className = type;
    messageElement.style.display = 'block';
  
    // Hide the message after 3 seconds
    setTimeout(() => {
      messageElement.style.display = 'none';
    }, 3000);
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
      cardClone.querySelector('#news-index').textContent = `#${index + 1}`;
  
      // Add a data attribute for easier card identification
      cardClone.querySelector('.news-card').setAttribute('data-news-id', newsItem.newsid);
  
      // You might want to set a default image or use a field from your database if available
      cardClone.querySelector('#news-img').src = 'https://via.placeholder.com/400x200';
  
      container.appendChild(cardClone);
    });
  }