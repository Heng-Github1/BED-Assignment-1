document.addEventListener('DOMContentLoaded', function() {
    const headlineInput = document.getElementById('headline');
    const contentInput = document.getElementById('content');
    const countrySelector = document.getElementById('countrySelector');
  
    document.querySelector('button').addEventListener('click', async () => {
      const newArticleData = {
        headline: headlineInput.value,
        content: contentInput.value,
        country: countrySelector.value
      };
  
      try {
        await createNews(newArticleData);
        alert('News article created successfully!');
        redirectToIndex();
      } catch (error) {
        console.error('Error creating news article:', error);
      }
    });
  });
  
  async function createNews(newArticleData) {
    if (newArticleData.headline && newArticleData.content && newArticleData.country) {
      try {
        const response = await fetch('/newsArticle', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newArticleData),
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        console.log('News article created:', data);
      } catch (error) {
        console.error('Error creating news article:', error);
      }
    } else {
      alert('Please fill in all fields');
    }
  } 
  function redirectToIndex() {
    window.location.href = 'index(news).html';
  }
