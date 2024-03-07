// allows admins to delete posts in response to clicking the delete button
// linked to "adminPosts.handlebars"

const deletePost = async (evt) => {
  const OK = confirm('Are you sure you want to delete this post?');
  if (OK) {
    const postID = evt.target.dataset.id;
    const res = await fetch(`/api/posts/${postID}`, {
      method: 'DELETE'
    });
    if (res.ok) {
      document.location.reload();
    } else {
      alert(`Failed to delete post, status: ${res.statusText}`);
    };
  };
}

document
  .querySelectorAll('button.delete-post')
  .forEach( (el) => el.addEventListener('click', deletePost));
