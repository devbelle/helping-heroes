document.addEventListener('DOMContentLoaded', () => {

  //create post
  const createPostTextbox = document.querySelector('input[name="post-title"]');
  const postContent = document.querySelector('textarea[name="content"]');
  const createPostBtn = document.querySelector('.post-btn');

  const createPost = async () => {
    const title = createPostTextbox.value;
    const content = postContent.value;

    if (title && content) {
      const response = await fetch('/api/posts', {
        method: 'POST',
        body: JSON.stringify({ title, content }),
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        document.location.reload();
      } else {
        alert('Failed to create post');
      }
    } else {
      alert('Please enter a title and content');
    }
  };

  createPostBtn.addEventListener('click', createPost);

  //delete post
  const deleteButtons = document.querySelectorAll('.delete-post-btn');

  deleteButtons.forEach(button => {
    button.addEventListener('click', async (event) => {
      const postId = event.target.dataset.id;

      const response = await fetch(`/api/posts/${postId}`, { method: 'DELETE', });

      if (response.ok) {
        document.location.reload();
      } else {
        alert('Failed to delete post');
      }
    });
  });

  //edit response
  const editResponseForm = document.querySelector('.edit-response-form');

  if (editResponseForm) {
    editResponseForm.addEventListener('submit', async (event) => {
      event.preventDefault(); // Prevent the default form submission

      const responseContent = editResponseForm.querySelector('textarea[name="response-content"]').value;
      const responseId = editResponseForm.querySelector('.delete-response-btn').dataset.id;

      const response = await fetch(`/api/responses/${responseId}`, {
        method: 'PUT',
        body: JSON.stringify({ content: responseContent }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        alert('Response updated successfully');
        // You can redirect or reload the page after successful update
      } else {
        alert('Failed to update response');
      }
    });
  }

  const deleteResponse = async (event) => {
    const responseId = event.target.dataset.id;

    const response = await fetch(`/api/responses/${responseId}`, { method: 'DELETE' });

    if (response.ok) {
      document.location.reload();
    } else {
      alert('Failed to delete response');
    }
  } // end deleteResponse callback function

  //delete response event listeners
  document
    .querySelectorAll('button.delete-response-btn')
    .forEach((el) => el.addEventListener('click', deleteResponse));

}, false);  // end DOM ready
