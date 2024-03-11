// allows admins to delete posts in response to clicking the delete button
// linked to "adminPosts.handlebars"

var postList = new List('all-posts', { valueNames: [ 'post-title', 'username', 'date' ] });

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


const dropdown2 = document.getElementById('dropdown2');


function isActive2() {
    if (dropdown2.classList.contains('is-active')) {
      dropdown2.classList.remove('is-active');
    } else {
      dropdown2.classList.add('is-active');
    }
  }


dropdown2.addEventListener('click', isActive2);

document
  .querySelectorAll('button.delete-post')
  .forEach( (el) => el.addEventListener('click', deletePost));
