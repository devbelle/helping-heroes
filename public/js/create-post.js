
//create post
document.addEventListener('DOMContentLoaded', () => {
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
});
//new code


//delete post
document.addEventListener('DOMContentLoaded', () => {
  const deleteButtons = document.querySelectorAll('.delete-post-btn');

  deleteButtons.forEach(button => {
      button.addEventListener('click', async (event) => {
          const postId = event.target.dataset.id;

          const response = await fetch(`/api/posts/${postId}`, {
              method: 'DELETE',
              headers: {
                  'Content-Type': 'application/json'
              }
          });

          if (response.ok) {
              document.location.reload();
          } else {
              alert('Failed to delete post');
          }
      });
  });
});

//edit response 
document.addEventListener('DOMContentLoaded', () => {
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
//delete response
      const deleteResponseBtn = editResponseForm.querySelector('.delete-response-btn');
      deleteResponseBtn.addEventListener('click', async (event) => {
          const responseId = event.target.dataset.id;

          const response = await fetch(`/api/responses/${responseId}`, {
              method: 'DELETE',
              headers: {
                  'Content-Type': 'application/json'
              }
          });

          if (response.ok) {
              alert('Response deleted successfully');
              // You can redirect or reload the page after successful deletion
          } else {
              alert('Failed to delete response');
          }
      });
  }
});





//create post
// document.addEventListener('DOMContentLoaded', () => {
    
    // const createPostTextbox = document.querySelector('input[name="post-title"]');
    // const postContent = document.querySelector('textarea[name="content"]');
    // const createPostBtn = document.querySelector('.post-btn');
    // // const deletePostBtn = document.querySelector('delete-post-btn').forEach(button =>) ;

    // const createPost = async (evt) => {
    //     // get the post ID to which to attach the response
    //     const post_id = evt.target.dataset.id;
    //     const title = createPostTextbox.value;
    //     // get the contents of the textbox (ie the response the user wishes to add)
    //     const content = postContent.value;
    
    //     // on to the CRUD
    //     if (content) {
    //       response = await fetch('/api/posts', {
    //         method: 'POST',
    //         body: JSON.stringify({ post_id, title, content }),
    //         headers: { 'Content-Type': 'application/json' }
    //       });
    
    //       if (response.ok) {
    //         document.location.reload();
    //       }
    //     }

        // createPostBtn.addEventListener('click', createPost);    
    //}


//old code
    // const deletePostBtn = document.querySelector('delete-post-btn').forEach(button => {
    //     button.addEventListener('click', async function (event) {
    //         event.preventDefault();

    //     })
    //}) ;





//delete post
    // const deletePost = async (evt) => {
    //     const post_id = evt.target.dataset.id;

    //     if (post_id) {
    //         response = await fetch(`/api/post/${post_id}`, {
    //           method: 'DELETE',
    //         });
      
    //         if (response.ok) {
    //           document.location.reload();
    //         }
    //       }

    //     //   deletePostBtn.addEventListener('click', deletePost)
    // }
    // createPostBtn.addEventListener('click', createPost); 
    // deletePostBtn.addEventListener('click', deletePost);
// }, false);



