async function createNews() {
    // Get the selected topic
    const topicSelect = document.getElementById('countrySelector');
    const selectedTopic = topicSelect.value;
  
    // Get the headline
    const headlineInput = document.getElementById('headline');
    const headline = headlineInput.value;
  
    // Get the content
    const contentInput = document.getElementById('content');
    const content = contentInput.value;
        
    // Validate inputs
    if (!selectedTopic || !headline || !content) {
        alert('Please fill in all fields');
        return;
    }
  
    // Prepare the news article data
    const newArticleData = {
        headline: headline,
        content: content,
        country: selectedTopic // Using 'country' as the field name as per your database schema
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
  
  // Function to redirect to index page
  function redirectToIndex() {
    window.location.href = 'index(news).html';
  }
  
  // Attach the createNews function to the button click event
  document.querySelector('button[onclick="createNews(); redirectToIndex()"]').onclick = async function(e) {
    e.preventDefault(); // Prevent default form submission
    await createNews();
    redirectToIndex();
  };