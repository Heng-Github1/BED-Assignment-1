async function createNews() {
    const topicSelect = document.getElementById('countrySelector');
    const selectedTopic = topicSelect.value;
  
    const headlineInput = document.getElementById('headline');
    const headline = headlineInput.value;
  
    const contentInput = document.getElementById('content');
    const content = contentInput.value;
        
    if (!selectedTopic || !headline || !content) {
        alert('Please fill in all fields');
        return;
    }
  
    const newArticleData = {
        headline: headline,
        content: content,
        country: selectedTopic 
    };
  
    try { 
      console.log('Sending data:', newArticleData);
      const response = await fetch('/newsArticle', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(newArticleData)
      });
      console.log('Response status:', response.status);
      
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('News created:', result);
      alert('News article created successfully!');
  
      // Clear the form
      topicSelect.value = '';
      headlineInput.value = '';
      contentInput.value = '';
  
  } catch (error) {
      console.error('Error:', error);
      alert('Failed to create news article. Please try again.');
  }}
  
  // Redirect to index page
  function redirectToIndex() {
    window.location.href = 'newsHomePage.html';
  }
  
  // Attach the createNews function
  document.querySelector('button[onclick="createNews(); redirectToIndex()"]').onclick = async function(e) {
    e.preventDefault(); 
    await createNews();
    redirectToIndex();
  };