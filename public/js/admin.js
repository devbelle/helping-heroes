document.addEventListener('DOMContentLoaded', () => {
  // functionality to ban or delete a user
  var options = {
    valueNames: ['username', 'ban', 'posts', 'responses', 'admin'],
    pagination: true,
    page: 10
  };

  var userList = new List('users', options);

  const toggleBan = async (evt) => {
    // allow an admin to toggle the ban status of a user
    let user_id = evt.target.dataset.id;
    const response = await fetch(`/api/users/ban/${user_id}`, { method: 'PUT' });
    if (response.ok) {
      evt.target.innerHTML === 'yes' ?
        evt.target.innerHTML = 'no' :
        evt.target.innerHTML = 'yes';
    } else {
      alert(`Failed to toggle banned status; ${response.statusText}`);
    }
  };

  const deleteUser = async (evt) => {
    let user_id = evt.target.dataset.id;
    // need to account for possibly clicking inner icon
    if (!user_id) user_id = evt.target.parentElement.dataset.id;

    const OK = confirm('Are you sure you want to delete this user?');

    if (OK) {
      const response = await fetch(`/api/users/delete/${user_id}`, { method: 'DELETE' });
      if (response.ok) {
        document.location.reload();
      } else {
        alert(`Failed to delete user; ${response.statusText}`);
      }
    }
  };

  // click button to toggle user ban status
  document
    .querySelectorAll('button.ban')
    .forEach((el) => el.addEventListener('click', toggleBan));

  // delete user
  document
    .querySelectorAll('button.delete-user')
    .forEach((el) => el.addEventListener('click', deleteUser));

}, false);  // end DOM ready
